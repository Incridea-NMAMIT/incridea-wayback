import { useMutation, useQuery } from "@apollo/client";
import { ComboBox } from "~/components/ui/combobox";
import Link from "next/link";
import {
  useState,
  Fragment,
  type FormEvent,
} from "react";
import {
  AiFillEye,
  AiFillEyeInvisible,
} from "react-icons/ai";
import { BiErrorCircle } from "react-icons/bi";

import { Button } from "~/components/button/button";
import Spinner from "~/components/spinner";
import { CONSTANT } from "~/constants";
import { AuthFormType } from "~/enums";
import {
  CollegesDocument,
  EmailVerificationDocument,
  SignUpDocument,
} from "~/generated/generated";


const SignUpForm = ({
  setCurrentForm,
}: {
  setCurrentForm: (
    currentForm: AuthFormType,
  ) => void;
}) => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    college: "",
    email: "",
    password: "",
    phoneNumber: "",
    accepted: false,
  });
  const [error, setError] = useState("");
  const [verifyError, setVerifyError] = useState(false);

  const [emailSuccess, setEmailSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signUpMutation, { loading, error: mutationError }] =
    useMutation(SignUpDocument);

  const [
    emailVerificationMutation,
    { loading: emailVerificationLoading, error: emailVerificationError },
  ] = useMutation(EmailVerificationDocument);

  const { data: collegeData, loading: collegesLoading } =
    useQuery(CollegesDocument);

  const sortColleges = () => {
    if (collegeData?.colleges.__typename !== "QueryCollegesSuccess") return [];

    const nmamit = collegeData.colleges.data.find(
      (college) => college.id === `${CONSTANT.NMAMIT_COLLEGE_ID}`,
    );

    return [
      ...(nmamit ? [nmamit] : []),
      ...(collegeData.colleges.data.filter((college) => college.id !== `${CONSTANT.NMAMIT_COLLEGE_ID}`))];
  };

  const sortedColleges = sortColleges();

  const [selectedCollegeId, setSelectedCollegeId] = useState<string>("");

  const resendEmail = async () => {
    setEmailSuccess(false);
    await emailVerificationMutation({
      variables: {
        email: userInfo.email,
      },
    }).then((res) => {
      if (res.data?.sendEmailVerification.__typename === "Error") {
        setError(res.data.sendEmailVerification.message);
      } else {
        setEmailSuccess(true);
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setVerifyError(false);
    setError("");

    if (
      !userInfo.name ||
      !userInfo.email ||
      !userInfo.password ||
      !userInfo.phoneNumber ||
      !userInfo.college
    ) {
      setError("Please fill all the fields");
      return;
    }

    if (selectedCollegeId === "") {
      setError("Please select a college");
      return;
    }

    if (selectedCollegeId === `${CONSTANT.NMAMIT_COLLEGE_ID}`) {
      if (userInfo.email.split("@").length > 1) {
        setError('Please only enter your USN without "@nmamit.in"');
        return;
      }
    }

    if (
      userInfo.phoneNumber.length !== 10 ||
      isNaN(Number(userInfo.phoneNumber))
    ) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    if (userInfo.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const { data: signUpData } = await signUpMutation({
      variables: {
        name: userInfo.name,
        email:
          selectedCollegeId === `${CONSTANT.NMAMIT_COLLEGE_ID}`
            ? `${userInfo.email.trim()}@nmamit.in`
            : userInfo.email,
        password: userInfo.password,
        phoneNumber: userInfo.phoneNumber.trim(),
        collegeId: Number(userInfo.college),
      },
    })

    if (!signUpData) {
      setError("An error occurred!");
      return
    }

    if (signUpData.signUp.__typename === "Error") {
      setError(signUpData.signUp.message);
      if (signUpData.signUp.message.includes("verify")) setVerifyError(true);
      return
    }

    const { data: emailVerifyData } = await emailVerificationMutation({
      variables: {
        email:
          selectedCollegeId === `${CONSTANT.NMAMIT_COLLEGE_ID}`
            ? `${userInfo.email}@nmamit.in`
            : userInfo.email,
      },
    })

    if (!emailVerifyData) {
      setError("An error occurred!");
      return
    }

    if (emailVerifyData.sendEmailVerification.__typename === "Error") {
      setError(emailVerifyData.sendEmailVerification.message);
      return
    }

    if (typeof window !== "undefined")
      // Checked in /login route
      window.localStorage.setItem("user-has-signed-up", "true");

    setEmailSuccess(true);
  };

  // NOTE: changes handler for all fields except college
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setError("");
    setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex min-h-full flex-col justify-center gap-3 px-3 py-3 ${loading && "pointer-events-none cursor-not-allowed"
        }`}
    >
      <p className="mb-2 text-center text-2xl font-medium">
        Welcome Timekeeper
      </p>

      {!emailSuccess && (
        <>
          <input
            value={userInfo.name}
            onChange={handleChange}
            name="name"
            type="text"
            required
            className="border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white/90 md:text-base md:focus:border-[#dd5c6e]"
            placeholder="Name"
          />

          <ComboBox
            variant="ghost"
            className="border-0 w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white/90 hover:bg-transparent font-normal hover:text-inherit md:text-base md:focus:border-[#dd5c6e] rounded-none focus-visible:ring-0"
            popoverClassName="w-full"
            data={sortedColleges}
            value={selectedCollegeId}
            setValue={(value) => {
              const college =
                sortedColleges.find((c) => c.id === value) ?? null;
              setUserInfo((prev) => ({
                ...prev,
                college: college?.id ?? "",
              }));
              setSelectedCollegeId(college?.id ?? "");
            }}
            placeholder="College"
          >
            {
              collegesLoading ?
                <div className="size-full flex justify-center items-center">
                  <Spinner />
                </div>
                :
                <div className="select-none text-xs font-semibold text-gray-700 max-w-full md:text-base text-wrap">
                  College not found. Please{" "}
                  <Link
                    href="/contact"
                    className="cursor-pointer underline hover:text-gray-700"
                  >
                    contact admin.
                  </Link>
                </div>
            }
          </ComboBox>

          <div className="relative">
            <input
              value={userInfo.email}
              onChange={handleChange}
              name="email"
              required
              className={`${selectedCollegeId == `${CONSTANT.NMAMIT_COLLEGE_ID}` && "pr-28"
                } w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white/90 md:text-base md:focus:border-[#dd5c6e]`}
              placeholder="Email"
            />
            {selectedCollegeId === `${CONSTANT.NMAMIT_COLLEGE_ID}` && (
              <span className="absolute right-0 top-0 mr-3 mt-2">
                @nmamit.in
              </span>
            )}
          </div>
          <div className="relative">
            <input
              value={userInfo.password}
              onChange={handleChange}
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="w-full border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white/90 md:text-base md:focus:border-[#dd5c6e]"
            />
            <button
              type="button"
              className="absolute right-0 top-0 mt-2 w-fit rounded-sm p-2 hover:bg-orange-500 hover:bg-opacity-10"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </button>
          </div>
          <input
            value={userInfo.phoneNumber}
            onChange={handleChange}
            name="phoneNumber"
            type="text"
            required
            placeholder="Mobile"
            className="border-b border-gray-400 bg-transparent px-1 py-2 text-sm outline-none transition-all placeholder:text-white/90 md:text-base md:focus:border-[#dd5c6e]"
          />

          <div className="flex">
            <input
              required
              type="checkbox"
              className="mr-2"
              checked={userInfo.accepted}
              id="termsCheckbox"
              onChange={() =>
                setUserInfo((prev) => ({
                  ...prev,
                  accepted: !prev.accepted,
                }))
              }
            />
            <label htmlFor="termsCheckbox">
              <span className="text-xs text-white md:text-base lg:text-sm">
                I agree to all the{" "}
                <Link
                  href="/rules"
                  className="cursor-pointer underline hover:text-slate-100"
                >
                  T&C
                </Link>{" "}
                and{" "}
                <Link
                  href="/guidelines"
                  className="cursor-pointer underline hover:text-slate-100"
                >
                  Guidelines
                </Link>{" "}
              </span>
            </label>
          </div>

          <Button className="mt-3 font-life-craft text-lg tracking-widest">
            Sign Up
          </Button>
        </>
      )
      }

      {(error ?? mutationError ?? emailVerificationError) && (
        <div className="flex min-w-full items-center gap-3 overflow-x-auto rounded-md bg-primary-900/70 p-2 px-4 font-semibold text-red-500">
          <BiErrorCircle className="shrink-0" />
          <div>
            {error}
            {verifyError && (
              <button
                type="button"
                onClick={() => setCurrentForm("RESEND_EMAIL")}
                className="inline-block text-start text-sm font-normal text-red-500 underline transition-colors hover:text-red-700"
              >
                Click here to resend verification email
              </button>
            )}
          </div>
        </div>
      )}

      {
        emailSuccess && (
          <div className="flex flex-col items-center gap-3 rounded-md bg-primary-900/70 p-4 text-center font-semibold text-secondary-600">
            <div>
              Verification email sent to {userInfo.email}
              {selectedCollegeId === `${CONSTANT.NMAMIT_COLLEGE_ID}` && "@nmamit.in"}
              <br />
              Please check your inbox.
              <hr className="mx-3 my-2 border-secondary-600" />
              <div className="text-sm font-normal">
                <p>Didn&apos;t receive the email?</p>
                <p>Make sure to check your spam folder.</p>
                <button
                  type="button"
                  onClick={resendEmail}
                  className="text-sm font-normal text-secondary-400 underline transition-colors hover:font-medium"
                >
                  Click here to resend it
                </button>
              </div>
            </div>
          </div>
        )
      }

      {(loading || emailVerificationLoading) && (
        <div className="absolute inset-0 z-10 flex h-full w-full cursor-not-allowed flex-col items-center justify-center gap-4 rounded-lg opacity-60">
          <Spinner className="my-0 h-fit text-[#dd5c6e]" intent={"primary"} />
          {emailVerificationLoading && (
            <p className="font-semibold">Sending Verification Email</p>
          )}
        </div>
      )}

      <div className="relative flex flex-col text-center">
        <hr className="my-3 border-accent-50" />
        <h4 className="absolute right-1/2 top-0.5 mx-auto w-max translate-x-1/2 rounded-full bg-accent-900/90 px-5 py-0.5 text-sm text-accent-50">
          Already have an account?
        </h4>
        <Button
          variant={"ghost"}
          onClick={() => {
            setCurrentForm(AuthFormType.SIGN_IN);
          }}
          type="button"
          className="mt-4 font-life-craft text-lg tracking-widest"
        >
          Sign in instead
        </Button>
      </div>

      {(loading || emailVerificationLoading) && (
        <div className="absolute inset-0 z-10 flex h-full w-full cursor-not-allowed flex-col items-center justify-center gap-4 rounded-lg opacity-60">
          <Spinner className="my-0 h-fit text-[#dd5c6e]" intent={"primary"} />
          {emailVerificationLoading && (
            <p className="font-semibold">Sending Verification Email</p>
          )}
        </div>
      )}
    </form>
  );
};
export default SignUpForm;
