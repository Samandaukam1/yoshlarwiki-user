import Link from "next/link";

import { Logo } from "./logo";
import { GithubIcon, InstagramIcon, LinkedinIcon, TelegramIcon } from "@/components/social-icons";
import { footerLinks, siteConfig } from "@/lib/site";

const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/yoshlarwiki", Icon: LinkedinIcon },
  { label: "Instagram", href: "https://instagram.com/yoshlarwiki", Icon: InstagramIcon },
  { label: "Telegram", href: "https://t.me/yoshlarwiki", Icon: TelegramIcon },
  { label: "GitHub", href: "https://github.com/yoshlarwiki", Icon: GithubIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-line">
      <div className="yw-container flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between md:gap-6">
        <div>
          <Logo size="sm" />
          <p className="mt-2 text-[12px] text-ink-3">
            © {year} {siteConfig.name}.uz — Barcha huquqlar himoyalangan.
          </p>
        </div>

        <nav aria-label="Pastki menyu">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13px] font-medium text-ink-2 transition-colors hover:text-accent-text"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex items-center gap-4">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="block text-accent-text transition-opacity hover:opacity-70"
              >
                <Icon className="size-[22px]" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
