
import VerifyEmail from "~/components/form/verifyEmail";
import LoginLayout from "~/components/layout/login";

const Page = () => {
  return (
    <LoginLayout >
      <div className="size-full relative">
        <VerifyEmail />
      </div>
    </LoginLayout >
  );
};

export default Page;
