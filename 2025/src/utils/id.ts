import { CONSTANT } from "~/constants";

export const idToPid = (id: string) => {
  return `${CONSTANT.PID_FORMAT}${id?.padStart(4, "0").toString()}`;
};

export const pidToId = (pid: string) => {
  return pid.startsWith(CONSTANT.PID_FORMAT)
    ? parseInt(pid.split("-")[1]!).toString()
    : "";
};

export const idToTeamId = (id: string) => {
  return `${CONSTANT.TID_FORMAT}${id?.padStart(5, "0").toString()}`;
};

export const teamIdToId = (teamId: string) => {
  return teamId.startsWith(CONSTANT.TID_FORMAT)
    ? parseInt(teamId.split("-")[1]!).toString()
    : "";
};
