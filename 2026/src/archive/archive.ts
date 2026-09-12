export interface ArchiveEvent {
  id: number;
  name: string;
  image?: string | null;
  venue?: string | null;
  maxTeams?: number | null;
  minTeamSize: number;
  maxTeamSize: number;
  isStarted: boolean;
  eventType: "INDIVIDUAL" | "TEAM" | "INDIVIDUAL_MULTIPLE_ENTRY" | "TEAM_MULTIPLE_ENTRY";
  category: "TECHNICAL" | "NON_TECHNICAL" | "CORE" | "SPECIAL";
  tier: "GOLD" | "SILVER" | "BRONZE" | "SPECIAL" | "ALL";
  prizePool?: number;
  rounds: Array<{ roundNo: number; date: string | null; isCompleted: boolean }>;
  day: Array<"Day1" | "Day2" | "Day3" | "Day4">;
  Schedule?: Array<{
    venue: string | null;
    venues?: Array<{ name: string }>;
    day: string;
    startTime: string | null;
    endTime: string | null;
    info: string | null;
    scheduleStatus: "Tentative" | "Published" | "Cancelled";
  }>;
  description?: string | null;
  organisers?: Array<{ name: string }>;
  roundsCount?: number;
  registeredCount?: number;
}

export interface ArchiveSnapshot {
  schemaVersion: 1;
  edition: {
    year: number;
    name: string;
    sourceCommit: string;
    exportedAt: string;
  };
  assets: Record<string, { path: string; sha256: string }>;
  data: {
    registrationConfig: Record<string, unknown>;
    events: ArchiveEvent[];
    coreTeam: Array<Record<string, unknown>>;
    committeeMembers: Array<{ title: string; members: string[] }>;
    championshipLeaderboard: { leaderboard: Array<Record<string, unknown>> };
    technicalTeam: { members: Array<Record<string, unknown>> };
  };
}

export const archiveYear = import.meta.env.VITE_ARCHIVE_YEAR?.trim();
export const isWaybackDirectory =
  import.meta.env.VITE_WAYBACK_DIRECTORY?.trim() === "true";
const snapshots = import.meta.glob<ArchiveSnapshot>("./snapshots/*.json", {
  eager: true,
  import: "default",
});

export const isArchiveMode = Boolean(archiveYear);
export const archiveHostname = archiveYear ? archiveYear + ".wayback.incridea.in" : "";
export const archiveSiteUrl = archiveHostname ? "https://" + archiveHostname : "";

const snapshotPath = archiveYear ? "./snapshots/" + archiveYear + ".json" : "";
export const archiveSnapshot = snapshotPath ? snapshots[snapshotPath] : undefined;

export function requireArchiveSnapshot(): ArchiveSnapshot {
  if (!isArchiveMode || !archiveSnapshot) {
    throw new Error(
      "Archive snapshot for " + (archiveYear ?? "the requested edition") + " is unavailable. " +
        "Generate it with the server archive exporter before deploying.",
    );
  }
  if (archiveSnapshot.edition.year !== Number(archiveYear)) {
    throw new Error("Archive build year does not match the snapshot edition year.");
  }
  return archiveSnapshot;
}
