// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AuthPageEnums {
  export const AuthFormType = {
    SIGN_IN: "SIGN_IN",
    SIGN_UP: "SIGN_UP",
    RESET_PASSWORD: "RESET_PASSWORD",
    RESEND_EMAIL: "RESEND_EMAIL",
  } as const;

  export type AuthFormType = (typeof AuthFormType)[keyof typeof AuthFormType];
}

export type AuthFormType = AuthPageEnums.AuthFormType;
export const AuthFormType = AuthPageEnums.AuthFormType;
