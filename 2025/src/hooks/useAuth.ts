import { useQuery } from "@apollo/client";

import { MeDocument } from "~/generated/generated";

export enum AuthStatus {
  LOADING = "loading",
  NOT_AUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
}

export const useAuth = () => {
  const { data, loading, error } = useQuery(MeDocument, {
    fetchPolicy: "cache-and-network",
  });

  if (loading)
    return {
      status: AuthStatus.LOADING,
      user: undefined,
      loading: loading,
      error: error,
    } as const;

  if (!data || data.me.__typename === "Error")
    return {
      status: AuthStatus.NOT_AUTHENTICATED,
      user: undefined,
      loading: loading,
      error: error,
    } as const;

  return {
    status: AuthStatus.AUTHENTICATED,
    user: data.me.data,
    loading: loading,
    error: error,
  } as const;
};
