import { useRouter } from "next/router";
import Dashboard from "~/components/layout/dashboard";
import { Role } from "~/generated/generated";
import { AuthStatus, useAuth } from "~/hooks/useAuth";

const Page = () => {
  const router = useRouter();
  const { user, status } = useAuth();

  if (status === AuthStatus.LOADING) return <Dashboard>Loading...</Dashboard>;

  if (status !== AuthStatus.AUTHENTICATED) {
    void router.push("/login");
    return <Dashboard>Loading...</Dashboard>;
  }

  switch (user.role) {
    case Role.Admin:
      void router.push("/dashboard/admin");
      return <Dashboard>Redirecting...</Dashboard>;
    case Role.BranchRep:
      void router.push("/dashboard/branchrep");
      return <Dashboard>Redirecting...</Dashboard>;
    case Role.Judge:
      void router.push("/dashboard/judge");
      return <Dashboard>Redirecting...</Dashboard>;
    case Role.Jury:
      void router.push("/dashboard/jury");
      return <Dashboard>Redirecting...</Dashboard>;
    case Role.Organizer:
      void router.push("/dashboard/organizer");
      return <Dashboard>Redirecting...</Dashboard>;
    case Role.Participant:
      void router.push("/profile");
      return <Dashboard>Redirecting...</Dashboard>;
    default:
      void router.push("/login");
      return <Dashboard>Redirecting...</Dashboard>;
  }
};

export default Page;
