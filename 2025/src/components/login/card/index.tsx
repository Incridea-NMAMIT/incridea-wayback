import React, { type CSSProperties, memo, useMemo } from "react";

import ResendEmail from "~/components/form/login/resendEmailForm";
import ResetPasswordForm from "~/components/form/login/resetPasswordForm";
import SignInForm from "~/components/form/login/signInForm";
import SignUpForm from "~/components/form/signUp";
import { AuthFormType } from "~/enums";

const LoginCard = memo(({
  thisForm,
  currentForm,
  setCurrentForm,
  redirectUrl,
}: {
  thisForm: AuthFormType
  currentForm: AuthFormType
  setCurrentForm: (
    thisForm: AuthFormType
  ) => void;
  redirectUrl?: string;
}) => {
  const cardStyle: CSSProperties = useMemo(() => (thisForm === currentForm ? {
    opacity: "100%",
    pointerEvents: "auto",
    transitionTimingFunction: "cubic-bezier(1,0,0,1)",
  } : {
    opacity: "0%",
    pointerEvents: "none",
    transitionTimingFunction: "cubic-bezier(1,0,0,1)"
  }), [thisForm, currentForm]);

  return (
    // HACK: Please update anything here or in children also in auth/reset-password.tsx
    <div
      className="size-full absolute top-0 left-0 origin-center duration-login"
      style={cardStyle}
    >
      <div className="relative size-full">
        <div className="absolute left-2/4 top-0 -translate-x-2/4 min-w-[80vw] max-w-[80vw] overflow-y-auto rounded-xl px-3 py-3 text-accent-100 transition-all ease-in-out sm:min-w-[350px] sm:max-w-[350px] bg-gradient-to-br from-green-800/95 to-green-700/80">
          {thisForm === AuthFormType.SIGN_UP && (
            <SignUpForm
              setCurrentForm={setCurrentForm}
            />
          )}
          {thisForm === AuthFormType.RESEND_EMAIL && (
            <ResendEmail
              setCurrentForm={setCurrentForm}
            />
          )}
          {thisForm === AuthFormType.SIGN_IN && (
            <SignInForm
              redirectUrl={redirectUrl}
              setCurrentForm={setCurrentForm}
            />
          )}
          {thisForm === AuthFormType.RESET_PASSWORD && (
            <ResetPasswordForm
              setCurrentForm={setCurrentForm}
            />
          )}
        </div>
      </div>
    </div>
  );
})

LoginCard.displayName = "LoginCard";

export default LoginCard;
