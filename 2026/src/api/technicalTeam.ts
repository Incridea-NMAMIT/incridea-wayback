import apiClient from "./client";
import { isArchiveMode, requireArchiveSnapshot } from "../archive/archive";

export interface TechnicalTeamMember {
  userId?: number;
  archiveId?: string;
  name: string;
  image: string | null;
  role: "Head" | "Co-Head" | "Member";
  quote: string | null;
  socials: {
    github: string | null;
    linkedin: string | null;
  };
  skills: string[];
}

export interface TechnicalTeamResponse {
  members: TechnicalTeamMember[];
}

export async function getTechnicalTeam(): Promise<TechnicalTeamResponse> {
  if (isArchiveMode) {
    return requireArchiveSnapshot().data.technicalTeam as unknown as TechnicalTeamResponse;
  }
  const { data } = await apiClient.get<TechnicalTeamResponse>(
    "/technical-team/list",
  );
  return data;
}
