type Provider = "kakao";

type Props = {
  provider: Provider;
  href: string;
};

const LABELS: Record<Provider, string> = {
  kakao: "카카오로 시작하기",
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

// Plain anchor on purpose: the OAuth start route answers with a cross-origin redirect.
export function ProviderButton({ provider, href }: Props) {
  return (
    <a className={`provider-button is-${provider}`} href={href}>
      <KakaoSymbol />
      <span>{LABELS[provider]}</span>
    </a>
  );
}
