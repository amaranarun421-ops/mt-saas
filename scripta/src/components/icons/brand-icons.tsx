/**
 * Brand SVG icons — used in the "Built on the best of the modern stack"
 * section and throughout the marketing site.
 *
 * All icons are inline SVG (no external requests), inherit currentColor,
 * and accept a `className` prop so they can be sized / themed anywhere.
 *
 * Sources: official brand SVGs from each company's marketing site or
 * simple-icons (https://simpleicons.org), simplified and inlined.
 */

type IconProps = {
  className?: string;
};

export function NextjsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c2.504 0 4.827-.768 6.733-2.078L7.06 6.78v9.785L4.746 18.5V5.5h2.547L18.7 18.49c-.16.105-.323.207-.488.305L9.477 5.5h-2.547v.013H4.746v.001H2.5v.001H0v.001zm17.5 12c0 5.523-4.477 10-10 10-2.07 0-3.985-.63-5.57-1.71l1.485-1.485A8 8 0 0 0 19.5 12c0-4.418-3.582-8-8-8a8 8 0 0 0-5.305 2L4.71 4.515A11.95 11.95 0 0 1 12 0c6.627 0 12 5.373 12 12z" />
    </svg>
  );
}

export function ReactIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

export function TypeScriptIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M1.5 0h21A1.5 1.5 0 0 1 24 1.5v21a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 0 22.5v-21A1.5 1.5 0 0 1 1.5 0Zm10.5 12.75v3.75h6.667c-.292 1.39-1.026 2.55-2.158 3.39-1.13.84-2.587 1.27-4.34 1.27-2.467 0-4.531-.834-6.182-2.5C4.334 17.012 3.5 14.857 3.5 12.18c0-2.687.834-4.842 2.49-6.467C7.641 4.078 9.733 3.25 12.27 3.25c1.625 0 3.054.41 4.286 1.234 1.232.823 2.117 1.95 2.659 3.384l-3.46 1.32c-.323-.918-.852-1.633-1.586-2.144-.733-.51-1.586-.766-2.555-.766-1.341 0-2.41.466-3.205 1.398-.795.933-1.193 2.205-1.193 3.815 0 1.61.395 2.882 1.184 3.815.789.933 1.857 1.398 3.205 1.398 1.118 0 2.05-.27 2.79-.81.74-.541 1.244-1.317 1.515-2.327H12Z" />
    </svg>
  );
}

export function TailwindIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.302 10.555 14.244 11.516 16.2 11.516c2.4 0 4.4-1.6 5.2-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C13.999 5.761 13.057 4.8 11.1 4.8h-.099zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.302 17.755 8.244 18.716 10.2 18.716c2.4 0 4.4-1.6 5.2-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C8.199 13.361 7.257 12.4 5.3 12.4h-.299Z" />
    </svg>
  );
}

export function PrismaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M21.807 18.289 10.392 1.215a.464.464 0 0 0-.398-.215h-7.05a.464.464 0 0 0-.398.695L13.93 19.18a.466.466 0 0 0 .398.215h7.05a.464.464 0 0 0 .429-.615zm-1.214-.238h-5.66L4.6 1.79h5.65l10.343 16.26zM9.585 2.4a.314.314 0 0 0-.508-.094l-.071.07c-.027.027-.06.05-.093.075a.31.31 0 0 0-.05.46l8.4 11.095-6.65-9.291a.314.314 0 0 0-.508-.093l-.071.07a.318.318 0 0 1-.082.058.31.31 0 0 0-.06.46l8.4 11.098-8.355-11.094z" />
    </svg>
  );
}

export function StripeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.489-4.536 1.401-1.155.952-1.757 2.324-1.757 3.961 0 2.979 1.825 4.242 4.806 5.319 1.917.681 2.559 1.171 2.559 1.917 0 .731-.629 1.155-1.792 1.155-1.43 0-3.785-.701-5.331-1.604l-.674 4.16c1.325.745 3.767 1.506 6.305 1.506 1.976 0 3.627-.467 4.758-1.354 1.249-.977 1.895-2.427 1.895-4.218 0-3.046-1.881-4.302-4.879-5.395z" />
    </svg>
  );
}

export function OpenaiIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9 5.985 5.985 0 0 0 4.504 2.01h.025a6.051 6.051 0 0 0 5.772-4.211 5.989 5.989 0 0 0 3.997-2.9 6.05 6.05 0 0 0-.744-7.096zm-9.022 12.61h-.018a5.023 5.023 0 0 1-2.42-.622l-.156-.093-2.008 1.18-.13-.075a4.962 4.962 0 0 1-2.27-2.94l3.51-2.047 4.99 2.921-.022.014 4.276 2.502a5.054 5.054 0 0 1-2.97 1.51l-.155.014-.155.012zm-9.51-7.555-.077-.13a5.036 5.036 0 0 1 .348-5.063l.07-.106V6.94l.025-.073.073-.022 4.4-2.575 4.954 2.873-.025.025 4.346 2.531-.012.018-.022.014v5.016l-.018.014-.024.018-4.521 2.638-4.95-2.91-.022.014-.022-.014-.024-.012zm-.485-9.697a5.018 5.018 0 0 1 4.954-1.244l.165.043 4.276 2.503-4.962 2.921-4.953-2.878-.025-.025.022-.018-.477-1.302zm17.495 4.975a4.998 4.998 0 0 1-.348 2.503l-.073.165-4.346 2.531v-5.845l4.962-2.878.025.025-.022.018.025.025-.223 2.455zm.223-3.076-.025.025-.024-.025-.025-.025-.024-.025v.025l-.022.025v.025l-.024.025-.024.025v.025l-4.954 2.878-4.962-2.878 4.962-2.921 4.953 2.878.025.025.025.025.025.025.025.025-.025.025v.025z" />
    </svg>
  );
}

export function ResendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M3.446 9.795c0-2.76.035-4.115.094-4.352.082-.328.224-.472.55-.394 1.31.31 2.4.987 3.421 2.183 2.932 3.43 5.78 9.418 6.51 14.16.094.612.122.746.155.746.033 0 .061-.134.155-.746.73-4.742 3.578-10.73 6.51-14.16 1.022-1.196 2.111-1.873 3.421-2.183.326-.078.468.066.55.394.059.237.094 1.592.094 4.352 0 3.504-.024 4.184-.155 4.994-.704 4.355-3.16 7.79-7.486 10.13-1.49.793-3.05 1.39-3.55 1.39-.5 0-2.06-.597-3.55-1.39-4.326-2.34-6.782-5.775-7.486-10.13-.131-.81-.155-1.49-.155-4.994z" />
    </svg>
  );
}

export function VercelIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2 22 20H2L12 2z" />
    </svg>
  );
}

export function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.37-3.88-1.37-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.97.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.3 1.2-3.1-.12-.3-.52-1.48.1-3.07 0 0 .98-.32 3.2 1.18a11.1 11.1 0 0 1 5.82 0c2.22-1.5 3.2-1.18 3.2-1.18.62 1.59.22 2.77.1 3.07.74.8 1.2 1.84 1.2 3.1 0 4.42-2.7 5.4-5.27 5.69.41.36.78 1.05.78 2.12v3.14c0 .3.21.66.79.55A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function DrizzleIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.156 0L4.964 9.768l3.708 4.282L20.96 0zM10.782 16.873l3.898 4.602 6.69-7.654-3.708-4.282z" />
      <path d="M4.964 9.768L0 13.434l3.708 4.282 5.822-3.666zm10.477 11.598L13.156 24h7.804l-2.297-3.36z" />
    </svg>
  );
}

export function ShadcnIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <path d="M14 14h7v7" />
    </svg>
  );
}

export function LucideIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 2 4 7l8 5 8-5-8-5zM4 17l8 5 8-5M4 12l8 5 8-5" />
    </svg>
  );
}

export function SonnerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 9h18M3 15h18M5 5l14 14M19 5 5 19" />
    </svg>
  );
}
