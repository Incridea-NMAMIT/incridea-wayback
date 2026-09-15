import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { GiConfirmed } from "react-icons/gi";
import { MdError } from "react-icons/md";

import Spinner from "~/components/spinner";
import { VerifyEmailDocument } from "~/generated/generated";

const VerifyEmail = () => {
  const router = useRouter();
  const { token }: { token?: string } = router.query;

  const [error, setError] = useState<string | null>(null);
  const [isMutationExecuted, setIsMutationExecuted] = useState<boolean>(false);

  const [verifyMutation, { data, loading }] = useMutation(VerifyEmailDocument);

  useEffect(() => {
    const verifyToken = async () => {
      if (token && !isMutationExecuted) {
        setIsMutationExecuted(true);
        const { data: verifyData } = await verifyMutation({ variables: { token } })
        if (verifyData?.verifyEmail.__typename === "Error")
          setError(verifyData.verifyEmail.message);
      }
    }

    void verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isMutationExecuted]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      {loading && <Spinner intent={"primary"} className="text-[#dd5c6e]" />}
      {!token && (
        <div className="flex min-w-[300px] flex-col items-center justify-center rounded-md bg-primary-900/60  p-12 text-red-500">
          <MdError className="mx-auto my-6 text-7xl" />
          <h1>No token provided</h1>
        </div>
      )}
      {error && (
        <div className="flex min-w-[300px] flex-col items-center justify-center rounded-md bg-primary-900/60 p-12 text-red-500">
          <MdError className="mx-auto my-6 text-7xl text-red-600" />
          <h1>{error}</h1>
        </div>
      )}
      {data?.verifyEmail.__typename === "MutationVerifyEmailSuccess" && (
        <div className="rounded-md bg-primary-900/60 p-12 text-center text-secondary-600">
          <GiConfirmed className="mx-auto my-6 text-7xl" />
          <h1>Your email has been verified.</h1>
          <p>You can now login to your account.</p>
          <Link
            href={"/login?verify=true"}
            className="text-primary-600 underline hover:text-primary-500"
          >
            Click here to login
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail
