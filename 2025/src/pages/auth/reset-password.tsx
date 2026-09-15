import ResetPassword from "~/components/form/resetPassword";
import LoginLayout from "~/components/layout/login";

const Page = () => {
  return (
    <LoginLayout >
      <div className="size-full relative">
        <ResetPassword />
      </div>
    </LoginLayout >
  );
};

export default Page;
