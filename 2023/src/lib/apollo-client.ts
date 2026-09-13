import { ApolloClient, ApolloLink, InMemoryCache, Observable } from "@apollo/client";
import { mockEventById, mockEvents } from "./mock-data";

// A historical Wayback site must never contact the retired GraphQL API or
// submit registrations, payments, or profile changes.
const archiveLink = new ApolloLink(
  (operation) =>
    new Observable((observer) => {
      const id = operation.variables.id as string | undefined;
      const data: Record<string, unknown> = {
        PublishedEvents: { publishedEvents: mockEvents },
        PublishedEventsSlug: { publishedEvents: mockEvents },
        EventById: { eventById: mockEventById(id) },
        Colleges: { colleges: [] },
        Me: { me: null },
      };
      observer.next({ data: data[operation.operationName] ?? {} });
      observer.complete();
    }),
);

export default function createApolloClient() {
  return new ApolloClient({ link: archiveLink, cache: new InMemoryCache() });
}
