import { useMutation } from "@apollo/client";
import { type FormEventHandler, useState } from "react";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa";

import { Button } from "~/components/button/button";
import Spinner from "~/components/spinner";
import { AuthFormType } from "~/enums";
import { ResetPasswordEmailDocument } from "~/generated/generated";


const ResetPasswordForm = ({
  setCurrentForm
}: {
  setCurrentForm: (currentForm: AuthFormType) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [resetMutation, { data, loading, error: mutationError }] = useMutation(
    ResetPasswordEmailDocument,
  );


  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    // add some client side validations like empty fields, password length, etc.
    setError(null);
    e.preventDefault();
    if (email === "") return;

    resetMutation({
      variables: {
        email: email,
      },
    })
      .then((res) => {
        if (res.data?.sendPasswordResetEmail.__typename === "Error") {
          setError(res.data.sendPasswordResetEmail.message);
        }
      })
      .catch(console.log);
  };

  return (
    <>
      <form
        className={`relative flex min-h-full flex-col justify-center gap-2 px-3 py-3 ${loading && "pointer-events-none cursor-not-allowed"
          }`}
        onSubmit={handleSubmit}
      >
        <h2 className="pb-1 text-center text-2xl font-semibold">
          Forgot password?
        </h2>

        {data?.sendPasswordResetEmail.__typename ===
          "MutationSendPasswordResetEmailSuccess" ? (
          <>
            <div className="flex flex-col items-center gap-2 rounded-md bg-primary-900/70 p-4 pb-2 text-center font-semibold text-secondary-600 mt-4">
              <BiCheckCircle size={"2rem"} /> Reset link sent to your email.
              Please check your inbox.
            </div>
          </>
        ) : (
          <>
            <h6 className="mb-10 text-center">
              Enter your email to receive a password reset link
            </h6>
            <input
              value={email}
              onChange={({ target }) => {
                setError(null);
                setEmail(target.value);
              }}
              type="email"
              required
              className="md:focus:border-[#dd5c6e]-500 border-b border-gray-400 bg-transparent px-1 py-2 outline-none transition-all placeholder:text-white/90"
              placeholder="Email"
            />

            <Button
              type="submit"
              className="mt-4 mb-2 font-life-craft text-lg tracking-widest"
            >
              Send Reset Link
            </Button>

            {loading && (
              <div className="absolute inset-0 z-10 h-full w-full cursor-not-allowed rounded-lg opacity-60">
                <Spinner className="text-[#dd5c6e]" intent={"primary"} />
              </div>
            )}

            {(error ?? mutationError) && (
              <div className="flex min-w-full items-center gap-3 overflow-x-auto rounded-md bg-primary-900/70 p-2 px-4 text-sm font-semibold text-red-500">
                <BiErrorCircle size={"2rem"} />
                {error ?? mutationError?.message}
              </div>
            )}
          </>
        )}
        <Button
          variant={"ghost"}
          className="mt-3 font-life-craft text-lg tracking-widest"
          onClick={() => setCurrentForm(AuthFormType.SIGN_IN)}
        >
          <FaAngleLeft /> Go Back
        </Button>
      </form>
    </>
  );
};

export default ResetPasswordForm;
