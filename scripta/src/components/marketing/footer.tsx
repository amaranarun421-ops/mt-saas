import Link from 'next/link';
import { getCurrentYear } from '@/lib/utils';
import { ScriptaLogo } from '@/components/icons/scripta-logo';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.3 1.2-3.1-.12-.3-.52-1.48.1-3.07 0 0 .98-.32 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.62 1.59.22 2.77.1 3.07.74.8 1.2 1.84 1.2 3.1 0 4.42-2.7 5.4-5.27 5.69.41.36.78 1.05.78 2.12v3.14c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.65l-5.22-6.82-5.97 6.82H1.7l7.73-8.84L1.25 2.25H8.05l4.72 6.24 5.48-6.24Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.04 15.64Z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
    </svg>
  );
}

export function MarketingFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <ScriptaLogo className="h-8 w-8 transition-transform group-hover:scale-105" />
              <span className="text-lg font-bold tracking-tight">Scripta</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              The premium AI content-writing SaaS — blog posts, social captions,
              email copy, and product descriptions in one workspace.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <SocialLink href="https://github.com" label="GitHub">
                <GithubIcon className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://twitter.com" label="Twitter">
                <TwitterIcon className="h-4 w-4" />
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <LinkedinIcon className="h-4 w-4" />
              </SocialLink>
            </div>
          </div>

          <FooterCol
            title="Product"
            links={[
              { href: '/#features', label: 'Features' },
              { href: '/#modes', label: 'Write modes' },
              { href: '/pricing', label: 'Pricing' },
              { href: '/dashboard', label: 'Dashboard' },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { href: '/contact', label: 'Contact' },
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ]}
          />
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {getCurrentYear()} Scripta. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built on an{' '}
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-foreground"
            >
              MIT-licensed
            </a>{' '}
            open-source base.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-lg border border-border/60 bg-background hover:bg-muted transition"
    >
      {children}
    </a>
  );
}
