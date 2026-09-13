import { Event } from "@/src/generated/generated";

// Local, non-personal event data keeps the historical interface usable after
// the original 2023 API was retired.  The archive never contacts that API.
export const mockEvents = [
  {
    id: "archive-code-craft",
    name: "Code Craft",
    description:
      "A programming challenge for builders of every level. Bring your laptop and solve practical problems against the clock.",
    image: null,
    venue: "Innovation Lab",
    branch: { id: "cse", name: "CSE" },
    fees: "₹50",
    minTeamSize: 1,
    maxTeamSize: 3,
    maxTeams: 60,
    category: "TECHNICAL",
    eventType: "TEAM",
    published: true,
    organizers: [],
    rounds: [{ roundNo: 1, date: "2023-04-26T10:00:00.000Z", completed: false }],
  },
  {
    id: "archive-pixel-pulse",
    name: "Pixel Pulse",
    description:
      "Design a visual story around a surprise theme. Individual and team entries are welcome.",
    image: null,
    venue: "Design Studio",
    branch: { id: "ise", name: "ISE" },
    fees: "Free",
    minTeamSize: 1,
    maxTeamSize: 2,
    maxTeams: 40,
    category: "NON_TECHNICAL",
    eventType: "TEAM",
    published: true,
    organizers: [],
    rounds: [{ roundNo: 1, date: "2023-04-27T14:00:00.000Z", completed: false }],
  },
  {
    id: "archive-robot-rush",
    name: "Robot Rush",
    description:
      "Build, test, and race your bot through a compact obstacle course. Safety checks happen before each run.",
    image: null,
    venue: "Mechanical Block",
    branch: { id: "mech", name: "MECH" },
    fees: "₹100",
    minTeamSize: 2,
    maxTeamSize: 4,
    maxTeams: 25,
    category: "TECHNICAL",
    eventType: "TEAM",
    published: true,
    organizers: [],
    rounds: [{ roundNo: 1, date: "2023-04-28T09:30:00.000Z", completed: false }],
  },
] as unknown as Event[];

export const mockEventById = (id?: string) =>
  mockEvents.find((event) => event.id === id) ?? mockEvents[0];
