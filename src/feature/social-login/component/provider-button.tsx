type Provider = "kakao" | "google";

type Props = {
  provider: Provider;
  href: string;
};

const LABELS: Record<Provider, string> = {
  kakao: "카카오로 시작하기",
  google: "Google로 시작하기",
};

function KakaoSymbol() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.48 3 2 6.48 2 10.77c0 2.77 1.86 5.2 4.66 6.57-.2.75-.74 2.72-.85 3.14-.13.52.19.51.4.37.17-.11 2.64-1.79 3.7-2.52.68.1 1.38.15 2.09.15 5.52 0 10-3.48 10-7.71S17.52 3 12 3Z"
      />
    </svg>
  );
}

function GoogleSymbol() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.94 11.94 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}

// Plain anchor on purpose: the OAuth start route answers with a cross-origin redirect.
export function ProviderButton({ provider, href }: Props) {
  return (
    <a className={`provider-button is-${provider}`} href={href}>
      {provider === "kakao" ? <KakaoSymbol /> : <GoogleSymbol />}
      <span>{LABELS[provider]}</span>
    </a>
  );
}
