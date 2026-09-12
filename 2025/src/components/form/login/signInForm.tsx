import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import {
  type FormEventHandler,
  useState,
} from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";

import { Button } from "~/components/button/button";
import Spinner from "~/components/spinner";
import { AuthFormType } from "~/enums";


const SignInForm = ({
  setCurrentForm,
  redirectUrl,
}: {
  setCurrentForm: (
    currentForm: AuthFormType,
  ) => void;
  redirectUrl?: string;
}) => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    // add some client side validations like empty fields, password length, etc.
    e.preventDefault();
    setError("");
    setLoading(true);

    signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false,
    })
      .then((res) => {
        setLoading(false);
        return res;
      })
      .then(async (res) => {
        if (res?.error) {
          setLoading(false);
          if (res.error.includes("verify")) setVerifyError(true);
          if (res.error.includes("CredentialsSignin")) {
            setError("Invalid credentials");
          } else {
            setError(res.error);
          }
        }

        if (res?.ok) {
          setError("");
          setUserInfo({ email: "", password: "" });
          await router.push(
            redirectUrl ? decodeURIComponent(redirectUrl) : "/register",
          );
        }
      })
      .catch(console.log);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <form
        className={`relative z-40 flex min-h-full flex-col justify-center gap-3 px-3 py-3 ${loading && "pointer-events-none cursor-not-allowed"
          }`}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-3xl font-semibold">Welcome back!</h2>
        <h6 className="mb-10 text-center font-normal md:font-normal">
          Sign in using your email and password
        </h6>
        <input
          value={userInfo.email}
          id="email"
          onChange={handleChange}
          className="border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white/90 md:text-base md:focus:border-[#dd5c6e]"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <div className="relative">
          <input
            value={userInfo.password}
            id="password"
            onChange={handleChange}
            className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white/90 md:text-base md:focus:border-[#dd5c6e]"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
          />
          <button
            type="button"
            className="absolute right-0 top-0 mt-2 w-fit rounded-sm p-2 hover:bg-orange-500 hover:bg-opacity-10"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>

        <button
          onClick={() => setCurrentForm(AuthFormType.RESET_PASSWORD)}
          type="button"
          className="-md:mt-1 mb-2 w-fit text-start text-sm text-accent-300 hover:underline"
        >
          Forgot your password?
        </button>

        <Button
          variant={"default"}
          type="submit"
          className="mx-1 text-lg font-life-craft tracking-widest"
        >
          Login
        </Button>

        {loading && (
          <div className="absolute inset-0 z-10 h-full w-full cursor-not-allowed rounded-lg">
            <Spinner className="text-[#dd5c6e]" intent={"primary"} />
          </div>
        )}

        {error && (
          <div className="flex min-w-full max-w-[20px] items-center gap-3 overflow-x-auto rounded-md bg-primary-900/70 p-2 px-4 font-semibold text-red-500">
            <BiErrorCircle className="shrink-0" />
            <div>
              {error}
              {verifyError && (
                <button
                  type="button"
                  onClick={() => setCurrentForm(AuthFormType.RESEND_EMAIL)}
                  className="inline-block text-start text-sm font-normal text-red-500 underline transition-colors hover:text-red-700"
                >
                  Click here to resend verification email
                </button>
              )}
            </div>
          </div>
        )}

        <div className="relative mt-3 flex flex-col text-center md:mt-2">
          <hr className="my-3 border-accent-50" />
          <h4 className="absolute right-1/2 top-0.5 mx-auto w-max translate-x-1/2 rounded-full bg-accent-900/90 px-3 py-[1px] text-sm text-accent-50">
            New here?
          </h4>
          <Button
            type="button"
            onClick={() => {
              setCurrentForm(AuthFormType.SIGN_UP);
            }}
            variant={"ghost"}
            className="mx-1 mt-5 font-life-craft text-lg tracking-widest"
          >
            Sign up instead
          </Button>
        </div>
      </form>
    </>
  );
};

export default SignInForm;
