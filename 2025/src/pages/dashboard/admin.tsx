import { type NextPage } from "next";
import { useRouter } from "next/router";

import AdminTab from "~/components/general/dashboard/admin/adminTab";
import Dashboard from "~/components/layout/dashboard";
import Spinner from "~/components/spinner";
import { Role } from "~/generated/generated";
import { useAuth } from "~/hooks/useAuth";

const Admin: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading)
    return (<Dashboard>
      <div className="flex h-screen w-screen justify-center">
        <Spinner />
      </div>
    </Dashboard >
    );

  // 1. Redirect to login if user is not logged in
  if (!user) {
    void router.push("/login");
    return <Dashboard><div>Redirecting...</div></ Dashboard>;
  }

  // 2. Redirect to profile if user is not a admin
  if (user && user.role !== Role.Admin) {
    void router.push("/profile");
    return <Dashboard><div>Redirecting...</div></ Dashboard>;
  }

  return (
    <Dashboard>
      <h1 className="mb-3 text-4xl">
        Welcome <span className="font-semibold">{user?.name}</span>!
      </h1>
      <div className="mt-3">
        <AdminTab AdminId={user?.id} />
      </div>
    </Dashboard>
  );
};

export default Admin;
