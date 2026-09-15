import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const inputIndex = args.indexOf("--input");
const input = inputIndex === -1 ? undefined : args[inputIndex + 1];

if (!input) {
  throw new Error(
    "Usage: node scripts/update-core-team-snapshot.mjs --input <ordered-core-team.json>",
  );
}

const root = process.cwd();
const snapshotPath = path.join(root, "src", "archive", "snapshots", "2026.json");
const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));
const members = JSON.parse(await readFile(path.resolve(input), "utf8"));

if (!Array.isArray(members)) throw new Error("Core team export must be an array.");

let sawCoHead = false;
let previousRoleRank = -1;
let previousCommittee = "";
const coreTeam = members.map((member, index) => {
  if (!member || typeof member !== "object") throw new Error("Invalid core team member.");
  if (member.role !== "Head" && member.role !== "Co-Head") {
    throw new Error("Core team role must be Head or Co-Head.");
  }
  if (member.role === "Co-Head") sawCoHead = true;
  if (member.role === "Head" && sawCoHead) {
    throw new Error("Core team export must list all Heads before Co-Heads.");
  }
  const roleRank = member.role === "Head" ? 0 : 1;
  const committee = String(member.committee ?? "").trim();
  if (roleRank === previousRoleRank && committee.localeCompare(previousCommittee, "en", { sensitivity: "base" }) < 0) {
    throw new Error("Core team export must be alphabetical by committee within each role.");
  }
  previousRoleRank = roleRank;
  previousCommittee = committee;
  if (typeof member.imageSrc === "string") {
    const mirrored = snapshot.assets?.[member.imageSrc];
    if (!mirrored?.path) {
      throw new Error("Profile image is not mirrored in the archive: " + member.title);
    }
    member.imageSrc = mirrored.path;
  }
  return {
    id: index + 1,
    imageSrc: member.imageSrc ?? null,
    title: String(member.title ?? "").trim(),
    subtitle: String(member.subtitle ?? "").trim(),
    role: member.role,
    committee,
  };
});

snapshot.data.coreTeam = coreTeam;
await writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`Updated 2026 core team snapshot with ${members.length} members.`);
