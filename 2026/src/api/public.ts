import apiClient from "./client";
import { isArchiveMode, requireArchiveSnapshot } from "../archive/archive";
import archiveEvents from "../archive/generated-events.json";

export interface RegistrationFees {
  internalRegistrationFeeGen: number;
  internalRegistrationFeeInclusiveMerch: number;
  externalRegistrationFee: number;
  externalRegistrationFeeOnSpot: number;
  internalRegistrationOnSpot: number;
  alumniRegistrationFee: number;
  merchTshirtPrice: number;
  eventsOnlyRegistrationFee: number;
}

export interface RegistrationConfigResponse {
  isAccommodationEnabled: boolean;
  isRegistrationOpen: boolean;
  isSpotRegistration: boolean;
  allowOrganiser: boolean;
  showLeaderboard: boolean;
  showChampionship: boolean;
  merchOpen: boolean;
  enforceCommittee: boolean;
  enforceOrg: boolean;
  enforceBR: boolean;
  twoPassReg: boolean;
  allowMultiMerch: boolean;
  allowAlumniMerch: boolean;
  showTreasureHunt: boolean;
  fees: RegistrationFees;
}

export type PublicEventCategory =
  "TECHNICAL" | "NON_TECHNICAL" | "CORE" | "SPECIAL";
export type PublicEventTier = "GOLD" | "SILVER" | "BRONZE" | "SPECIAL" | "ALL";
export type PublicEventType =
  "INDIVIDUAL" | "TEAM" | "INDIVIDUAL_MULTIPLE_ENTRY" | "TEAM_MULTIPLE_ENTRY";

export interface PublicEventRound {
  roundNo: number;
  date: string | null;
  isCompleted: boolean;
}

export interface PublicEvent {
  id: number;
  name: string;
  image?: string | null;
  venue?: string | null;
  maxTeams?: number | null;
  minTeamSize: number;
  maxTeamSize: number;
  isStarted: boolean;
  eventType: PublicEventType;
  category: PublicEventCategory;
  tier: PublicEventTier;
  prizePool?: number;
  rounds: PublicEventRound[];
  day: ("Day1" | "Day2" | "Day3" | "Day4")[];
  Schedule?: {
    venue: string | null;
    venues?: { name: string }[];
    day: string;
    startTime: string | null;
    endTime: string | null;
    info: string | null;
    scheduleStatus: "Tentative" | "Published" | "Cancelled";
  }[];
}

export interface PublicEventOrganiser {
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface PublicEventDetail extends PublicEvent {
  description?: string | null;
  organisers: PublicEventOrganiser[];
  roundsCount?: number;
  registeredCount?: number;
}

export interface EventDayConfig {
  day1: string | null;
  day2: string | null;
  day3: string | null;
  day4: string | null;
}

export interface PublishedEventsResponse {
  events: PublicEvent[];
  days: EventDayConfig;
}

export interface PublishedEventResponse {
  event: PublicEventDetail;
}

const archiveEventDatabase = archiveEvents as unknown as PublicEventDetail[];

function archiveEventDays(): EventDayConfig {
  const dates = archiveEventDatabase
    .flatMap((event) => event.Schedule ?? [])
    .map((schedule) => schedule.startTime?.slice(0, 10))
    .filter((date): date is string => Boolean(date));
  return {
    day1: dates[0] ?? null,
    day2: dates[1] ?? null,
    day3: dates[2] ?? null,
    day4: dates[3] ?? null,
  };
}

export async function fetchRegistrationConfig(): Promise<RegistrationConfigResponse> {
  if (isArchiveMode) {
    const config = requireArchiveSnapshot().data.registrationConfig;
    return {
      ...config,
      isAccommodationEnabled: false,
      isRegistrationOpen: false,
      isSpotRegistration: false,
      merchOpen: false,
      allowOrganiser: false,
      showLeaderboard: false,
      showTreasureHunt: false,
    } as RegistrationConfigResponse;
  }
  const { data } = await apiClient.get<RegistrationConfigResponse>(
    "/public/registration-config",
  );
  return data;
}

export async function fetchPublishedEvents(): Promise<PublishedEventsResponse> {
  if (isArchiveMode) {
    return {
      events: archiveEventDatabase,
      days: archiveEventDays(),
    };
  }
  const { data } =
    await apiClient.get<PublishedEventsResponse>("/public/events");
  return data;
}

export async function fetchPublishedEvent(
  id: number,
): Promise<PublishedEventResponse> {
  if (isArchiveMode) {
    const event = archiveEventDatabase.find((candidate) => candidate.id === id);
    if (!event) {
      throw new Error("This event is not available in the archive.");
    }
    return {
      event: {
        ...event,
        organisers: event.organisers ?? [],
      },
    };
  }
  const { data } = await apiClient.get<PublishedEventResponse>(
    `/public/events/${id}`,
  );
  return data;
}
export interface College {
  id: number;
  name: string;
  details?: string | null;
  championshipPoints: number;
  type: string;
}

export async function fetchColleges() {
  const { data } = await apiClient.get<{ colleges: College[] }>(
    "/public/colleges",
  );
  return data.colleges;
}

export interface CoreTeamMember {
  id: number;
  imageSrc?: string | null;
  title: string;
  subtitle: string;
  role: string;
  committee: string;
}

export async function fetchCoreTeam(): Promise<CoreTeamMember[]> {
  if (isArchiveMode) {
    return requireArchiveSnapshot().data.coreTeam as unknown as CoreTeamMember[];
  }
  const { data } = await apiClient.get<{ team: CoreTeamMember[] }>(
    "/public/core-team",
  );
  return data.team;
}

export interface ChampionshipLeaderboardEntry {
  id: number;
  college: string;
  techEvents: number;
  nonTechEvents: number;
  total: number;
  eligible: boolean;
  wonEvents: {
    eventName: string;
    type: string;
    tier: string;
    points: number;
  }[];
}

export interface ChampionshipLeaderboardResponse {
  leaderboard: ChampionshipLeaderboardEntry[];
}

export async function fetchChampionshipLeaderboard(): Promise<ChampionshipLeaderboardResponse> {
  if (isArchiveMode) {
    return requireArchiveSnapshot().data.championshipLeaderboard as unknown as ChampionshipLeaderboardResponse;
  }
  const { data } = await apiClient.get<ChampionshipLeaderboardResponse>(
    "/public/championship-leaderboard",
  );
  return data;
}

export interface CreditsSection {
  title: string;
  members: string[];
}

export async function fetchCommitteeMembers(): Promise<CreditsSection[]> {
  const { data } = await apiClient.get<{ sections: CreditsSection[] }>(
    "/public/committee-members",
  );
  return data.sections;
}
