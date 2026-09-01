import { supabase } from "./supabase/server";
import type { Database } from "./supabase/database.types";

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Region = Database["public"]["Tables"]["regions"]["Row"];
export type HeroPortrait = Database["public"]["Tables"]["hero_portraits"]["Row"];

export type PublicStats = {
  candidates: number;
  categories: number;
  regions: number;
  achievements: number;
  approved_applications: number;
};

export type CandidateCard = {
  id: string;
  slug: string;
  full_name: string;
  title: string | null;
  portrait_url: string | null;
  portrait_alt: string | null;
  birth_place: string | null;
  specialization: string | null;
  direction: string | null;
  is_featured: boolean;
  view_count: number;
  region: { name: string; slug: string } | null;
  category: { name: string; slug: string; icon: string } | null;
};

export type SearchResult = {
  total: number;
  limit: number;
  offset: number;
  items: CandidateCard[];
};

export type CandidateProfile =
  Database["public"]["Tables"]["candidates"]["Row"] & {
    region: Region | null;
    primary_category: Category | null;
    categories: Category[];
    social_links: Database["public"]["Tables"]["candidate_social_links"]["Row"][];
    education: Database["public"]["Tables"]["candidate_education"]["Row"][];
    experience: Database["public"]["Tables"]["candidate_experience"]["Row"][];
    achievements: Database["public"]["Tables"]["candidate_achievements"]["Row"][];
    projects: Database["public"]["Tables"]["candidate_projects"]["Row"][];
    media: Database["public"]["Tables"]["candidate_media"]["Row"][];
  };

const EMPTY_STATS: PublicStats = {
  candidates: 0,
  categories: 0,
  regions: 0,
  achievements: 0,
  approved_applications: 0,
};

export async function getStats(): Promise<PublicStats> {
  const { data, error } = await supabase.rpc("get_public_stats");
  if (error || !data) return EMPTY_STATS;
  return { ...EMPTY_STATS, ...(data as unknown as PublicStats) };
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data ?? null;
}

export async function getRegions(): Promise<Region[]> {
  const { data } = await supabase
    .from("regions")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export async function getHeroPortraits(): Promise<HeroPortrait[]> {
  const { data } = await supabase
    .from("hero_portraits")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data ?? [];
}

export type SearchParams = {
  query?: string | null;
  category?: string | null;
  region?: string | null;
  limit?: number;
  offset?: number;
  sort?: "recent" | "name" | "popular";
};

export async function searchCandidates(
  params: SearchParams = {},
): Promise<SearchResult> {
  const limit = params.limit ?? 12;
  const offset = params.offset ?? 0;

  const { data, error } = await supabase.rpc("search_candidates", {
    p_query: params.query || undefined,
    p_category: params.category || undefined,
    p_region: params.region || undefined,
    p_limit: limit,
    p_offset: offset,
    p_sort: params.sort ?? "recent",
  });

  if (error || !data) {
    return { total: 0, limit, offset, items: [] };
  }
  return data as unknown as SearchResult;
}

export async function quickSearch(query: string) {
  const { data, error } = await supabase.rpc("quick_search", {
    p_query: query,
    p_limit: 6,
  });
  if (error || !data) {
    return { candidates: [], categories: [] };
  }
  return data as unknown as {
    candidates: {
      slug: string;
      full_name: string;
      title: string | null;
      portrait_url: string | null;
    }[];
    categories: { slug: string; name: string; icon: string }[];
  };
}

export async function getCandidateBySlug(
  slug: string,
): Promise<CandidateProfile | null> {
  const { data, error } = await supabase
    .from("candidates")
    .select(
      `*,
       region:regions(*),
       primary_category:categories!candidates_primary_category_id_fkey(*),
       candidate_categories(category:categories(*)),
       social_links:candidate_social_links(*),
       education:candidate_education(*),
       experience:candidate_experience(*),
       achievements:candidate_achievements(*),
       projects:candidate_projects(*),
       media:candidate_media(*)`,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  const linked = (row.candidate_categories ?? []) as { category: Category }[];

  const bySortOrder = <T extends { sort_order: number }>(list: T[]) =>
    [...list].sort((a, b) => a.sort_order - b.sort_order);

  return {
    ...(row as unknown as CandidateProfile),
    categories: linked.map((entry) => entry.category).filter(Boolean),
    social_links: bySortOrder((row.social_links ?? []) as never[]),
    education: bySortOrder((row.education ?? []) as never[]),
    experience: bySortOrder((row.experience ?? []) as never[]),
    achievements: bySortOrder((row.achievements ?? []) as never[]),
    projects: bySortOrder((row.projects ?? []) as never[]),
    media: bySortOrder((row.media ?? []) as never[]),
  };
}

export async function getPublishedSlugs(): Promise<
  { slug: string; updated_at: string }[]
> {
  const { data } = await supabase
    .from("candidates")
    .select("slug, updated_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getPublicSetting<T = Record<string, unknown>>(
  key: string,
): Promise<T | null> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return (data?.value as T) ?? null;
}

/** Bir nechta nomzodning kategoriyalar bo'yicha sonini qaytaradi. */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data } = await supabase
    .from("candidate_categories")
    .select("category_id, categories!inner(slug), candidates!inner(status)")
    .eq("candidates.status", "published");

  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as unknown as {
    categories: { slug: string };
  }[]) {
    const slug = row.categories?.slug;
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}
