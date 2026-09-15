import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { FaAngleLeft } from "react-icons/fa";

import { Button } from "~/components/button/button";
import Spinner from "~/components/spinner";
import { AuthFormType } from "~/enums";
import { EmailVerificationDocument } from "~/generated/generated";

const ResendEmail = ({ setCurrentForm }: {
  setCurrentForm: (currentForm: AuthFormType) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const [
    emailVerificationMutation,
    { data, loading, error: emailVerificationError },
  ] = useMutation(EmailVerificationDocument);

  const handleSubmit = async () => {
    setError(null);
    if (email === "") return;

    await emailVerificationMutation({
      variables: {
        email: email,
      },
    }).then((res) => {
      if (res.data?.sendEmailVerification.__typename === "Error") {
        setError(res.data.sendEmailVerification.message);
      }
    });
  };

  return (
    <>
      <form
        className={`relative flex min-h-full flex-col justify-center gap-2 px-3 py-3 ${loading && "pointer-events-none cursor-not-allowed"
          }`}
        onSubmit={async (e) => {
          e.preventDefault();
          await handleSubmit();
        }}
      >
        <h2 className="pb-1 text-center text-2xl font-semibold">
          Resend Verification Email
        </h2>
        {data?.sendEmailVerification.__typename ===
          "MutationSendEmailVerificationSuccess" ? (
          <div className="flex flex-col items-center gap-2 rounded-md bg-primary-900/70 p-4 pb-2 text-center font-semibold text-secondary-600">
            <BiCheckCircle size={"2rem"} />
            <div className="mb-5 flex flex-col items-center gap-3 rounded-md text-center font-semibold">
              Verification email sent to {email}
              <br />
              Please check your inbox.
              {/* <hr className="border-secondary-600 my-2 mx-3" /> */}
              <div className="text-sm font-normal">
                <p>Didn&apos;t recieve the email?</p>
                <p>Make sure to check your spam folder.</p>
                <button
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    await handleSubmit();
                  }}
                  className="text-sm font-normal text-secondary-400 underline transition-colors hover:font-medium"
                >
                  Click here to resend it
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h6 className="mb-10 text-center">
              Enter your email to receive a verification link
            </h6>
            <input
              value={email}
              onChange={({ target }) => {
                setError(null);
                setEmail(target.value);
              }}
              type="email"
              required
              className="border-b border-gray-400 bg-transparent px-1 py-2 outline-none transition-all placeholder:text-white/90 md:focus:border-red-500"
              placeholder="Email"
            />

            {(error ?? emailVerificationError) && (
              <div className="flex min-w-full items-center gap-3 overflow-x-auto rounded-md bg-primary-900/70 p-2 px-4 font-semibold text-red-500">
                <BiErrorCircle size={"1.3rem"} />
                {error ?? emailVerificationError?.message}
              </div>
            )}

            <Button
              type="submit"
              className="my-2 font-life-craft text-lg tracking-widest"
            >
              Send Verification Email
            </Button>

            {loading && (
              <div className="absolute inset-0 z-10 h-full w-full cursor-not-allowed rounded-lg opacity-60">
                <Spinner className="text-[#dd5c6e]" intent={"primary"} />
              </div>
            )}
          </>
        )}

        <Button
          variant={"ghost"}
          className="font-life-craft text-lg tracking-widest"
          onClick={() => setCurrentForm(AuthFormType.SIGN_IN)}
        >
          <FaAngleLeft /> Go Back
        </Button>
      </form>
    </>
  );
};

export default ResendEmail;
