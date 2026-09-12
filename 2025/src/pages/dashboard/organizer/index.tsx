import { type NextPage } from "next";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

import OrganizerTab from "~/components/general/dashboard/organizer/organizerTab";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import { Role } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const Organizer: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    );

  if (!user) {
    void router.push("/login");
    return <div>Redirecting...</div>;
  }

  if (user.role !== Role.Organizer && user.role !== Role.Admin) {
    void router.push("/profile");
    return null
  }

  return (
    <Dashboard>
      <Toaster />
      <div className="relative top-14 p-2 md:top-0">
        <h1 className="mb-3 text-3xl">
          Hello <span className="font-semibold">{user?.name}</span>!
        </h1>
        <OrganizerTab />
      </div>
    </Dashboard>
  );
};
export default Organizer;
