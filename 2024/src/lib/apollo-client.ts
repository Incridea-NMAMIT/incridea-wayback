import { ApolloClient, ApolloLink, InMemoryCache, Observable } from "@apollo/client";

// A historical Wayback site must never contact the retired GraphQL API or
// submit registrations, payments, or profile changes.
const archiveLink = new ApolloLink(
  () =>
    new Observable((observer) => {
      observer.next({ data: { me: null, events: [], publishedEvents: [] } });
      observer.complete();
    }),
);

export default function createApolloClient() {
  return new ApolloClient({ link: archiveLink, cache: new InMemoryCache() });
}
