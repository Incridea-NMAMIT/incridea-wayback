
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";

// Mock link that returns empty data or specific mocks for queries
// This prevents network errors when backend is not available
import { Observable } from "@apollo/client/utilities";

// Create a mock link that intercepts requests and returns mock data
const archiveLink = new ApolloLink(
  (operation) =>
    new Observable((observer) => {
      // Archive-only responses keep the historical UI interactive without
      // contacting the retired 2025 API. Each request completes immediately,
      // so auth-dependent controls settle to their signed-out state.
      observer.next({
        data: {
          me: { __typename: "Error", message: "Unauthenticated" },
          publishedEvents: [],
          events: [],
          getCoreTeamMembers: {
            __typename: "QueryGetCoreTeamMembersSuccess",
            data: [],
          },
          getSponsors: { __typename: "QueryGetSponsorsSuccess", data: [] },
          getTechTeamMembers: {
            __typename: "QueryGetTechTeamMembersSuccess",
            data: [],
          },
        },
      });
      observer.complete();
    }),
);

const mockLink = new ApolloClient({
  cache: new InMemoryCache(),
  link: archiveLink,
});

export const client = mockLink;

export const useApollo = (initialState : any) => {
    return mockLink; 
}
