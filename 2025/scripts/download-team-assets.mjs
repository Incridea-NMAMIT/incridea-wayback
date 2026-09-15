import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const snapshotPath = path.join(root, "src/archive/snapshots/2025-teams.json");
const assetDirectory = path.join(root, "public/2025/team");
const snapshot = JSON.parse(await readFile(snapshotPath, "utf8"));

const safeName = (name) =>
  name
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

const extensionFor = (contentType) => {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  return "jpg";
};

await mkdir(assetDirectory, { recursive: true });

const groups = [
  ["technical", snapshot.technicalTeam],
  ["core", snapshot.coreTeam],
];

for (const [group, members] of groups) {
  for (const [index, member] of members.entries()) {
    if (!member.imageUrl?.startsWith("http")) continue;

    const response = await fetch(member.imageUrl);
    if (!response.ok) {
      throw new Error(`Could not download ${member.name}: ${response.status}`);
    }

    const filename = `${group}-${String(index + 1).padStart(2, "0")}-${safeName(member.name)}.${extensionFor(response.headers.get("content-type"))}`;
    const targetPath = path.join(assetDirectory, filename);
    await writeFile(targetPath, Buffer.from(await response.arrayBuffer()));
    member.imageUrl = `/2025/team/${filename}`;
  }
}

const temporarySnapshotPath = `${snapshotPath}.tmp`;
await writeFile(temporarySnapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
await rename(temporarySnapshotPath, snapshotPath);
