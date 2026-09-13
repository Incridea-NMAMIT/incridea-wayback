import snapshot from "./snapshots/2025-teams.json";

export type TechnicalTeamMember = {
  name: string;
  role: string;
  instagram: string | null;
  github: string | null;
  linkedin: string | null;
  imageUrl: string;
  quote: string;
  order: number;
};

export type CoreTeamMember = {
  name: string;
  committee: string;
  designation: string;
  imageUrl: string;
};

export const technicalTeam = snapshot.technicalTeam as TechnicalTeamMember[];
export const coreTeam = snapshot.coreTeam as CoreTeamMember[];
