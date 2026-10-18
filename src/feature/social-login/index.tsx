import { oauthStartUrl } from "@/src/entity/auth";

import { ProviderButton } from "./component";

type Props = {
  // Same-origin path to return to after the provider redirects back.
  next: string;
};

export function SocialLogin({ next }: Props) {
  return (
    <div className="social-login">
      <ProviderButton provider="kakao" href={oauthStartUrl("kakao", next)} />
    </div>
  );
}
