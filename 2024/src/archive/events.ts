import type { Event } from "@/src/generated/generated";
import sourceEvents from "./events.json";

// This data is a read-only public-event export from the server database. The
// adapter preserves the legacy 2024 GraphQL shape without contacting an API.
export const archiveEvents = sourceEvents.map(
  (source, index) =>
    ({
      id: String(source.id),
      name: source.name,
      description: source.description,
      image: source.image,
      venue: source.venue,
      fees: 0,
      minTeamSize: source.minTeamSize,
      maxTeamSize: source.maxTeamSize,
      maxTeams: source.maxTeams,
      eventType: source.eventType,
      category: source.category,
      published: true,
      branch: { id: "archive", name: "CORE" },
      rounds: source.rounds.map((round) => ({
        roundNo: round.roundNo,
        date: round.date,
        completed: round.isCompleted,
      })),
      organizers: source.organisers.map((organizer, organizerIndex) => ({
        user: {
          id: `archive-${index + 1}-${organizerIndex + 1}`,
          name: organizer.name,
          email: null,
          phoneNumber: null,
        },
      })),
      teams: [],
    }) as unknown as Event,
);

export function getArchiveEvent(id: string | undefined) {
  return archiveEvents.find((event) => event.id === id) ?? null;
}
