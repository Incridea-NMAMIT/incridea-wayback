import { useRouter } from "next/router";
import { type ElementRef, useCallback, useRef, useState } from "react";
import LoginLayout from "~/components/layout/login";
import Loader from "~/components/loader";

import LoginCard from "~/components/login/card";
import { CONSTANT } from "~/constants";
import { AuthFormType } from "~/enums";
import { Role } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const Page = () => {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const {
    redirectUrl,
  }: {
    redirectUrl?: string;
  } = router.query;

  const layoutRef = useRef<ElementRef<typeof LoginLayout>>(null);

  const [currentForm, setCurrentForm] = useState<AuthFormType>(
    typeof window !== "undefined" &&
      // Set in signup mutation success
      localStorage.getItem("user-has-signed-up")
      ? AuthFormType.SIGN_IN
      : AuthFormType.SIGN_UP,
  );

  const changeCard = useCallback(
    async (newForm: AuthFormType) => {
      if (currentForm === newForm) return;

      const gearAudio = new Audio(CONSTANT.ASSETS.AUDIO.GEARSOUND);
      await gearAudio.play();

      layoutRef.current?.triggerGears();

      setCurrentForm(newForm);
    },
    [currentForm],
  );

  if (userLoading) return <Loader />;

  if (user && user.role === Role.User) {
    void router.push("/register");
    return null;
  }

  if (user) {
    void router.push("/profile");
    return null;
  }

  return (
    <LoginLayout ref={layoutRef}>
      <div className="size-full relative">
        <LoginCard
          thisForm={AuthFormType.SIGN_IN}
          currentForm={currentForm}
          setCurrentForm={changeCard}
          redirectUrl={redirectUrl}
        />
        <LoginCard
          thisForm={AuthFormType.RESET_PASSWORD}
          currentForm={currentForm}
          setCurrentForm={changeCard}
        />
        <LoginCard
          thisForm={AuthFormType.SIGN_UP}
          currentForm={currentForm}
          setCurrentForm={changeCard}
        />
        <LoginCard
          thisForm={AuthFormType.RESEND_EMAIL}
          currentForm={currentForm}
          setCurrentForm={changeCard}
        />
      </div>
    </LoginLayout>
  );
};

export default Page;
