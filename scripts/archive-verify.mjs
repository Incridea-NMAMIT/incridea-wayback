import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);
const getArg = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const year = getArg("--year");

if (!/^[0-9]{4}$/.test(year ?? "")) {
  throw new Error("Usage: node scripts/archive-verify.mjs --year YYYY");
}

const root = process.cwd();
const snapshotFile = path.join(root, "src", "archive", "snapshots", year + ".json");
let snapshot;
try {
  snapshot = JSON.parse(await readFile(snapshotFile, "utf8"));
} catch (error) {
  if (error && typeof error === "object" && error.code === "ENOENT") {
    throw new Error(
      "Archive snapshot is missing: " + snapshotFile + ". Run the server archive exporter first.",
    );
  }
  throw error;
}
const prohibitedKeys = new Set([
  "email",
  "phoneNumber",
  "phone",
  "userId",
  "pid",
  "password",
  "token",
  "payment",
  "orderId",
]);

function verifyValue(value, trace = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => verifyValue(item, trace + "[" + index + "]"));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    if (prohibitedKeys.has(key)) {
      throw new Error("Snapshot contains prohibited field at " + trace + "." + key);
    }
    verifyValue(nested, trace + "." + key);
  }
}

if (snapshot.schemaVersion !== 1 || snapshot.edition?.year !== Number(year)) {
  throw new Error("Snapshot schema version or edition year is invalid.");
}
if (
  typeof snapshot.edition?.sourceCommit !== "string" ||
  !/^[0-9a-f]{7,64}$/i.test(snapshot.edition.sourceCommit)
) {
  throw new Error("Snapshot source commit must be a Git SHA.");
}
if (!Array.isArray(snapshot.data?.events) || !snapshot.data?.technicalTeam) {
  throw new Error("Snapshot is missing required public datasets.");
}
verifyValue(snapshot.data);

for (const [source, asset] of Object.entries(snapshot.assets ?? {})) {
  if (!asset || typeof asset.path !== "string" || typeof asset.sha256 !== "string") {
    throw new Error("Invalid asset entry for " + source);
  }
  const filename = path.resolve(root, "public", asset.path.replace(/^\//, ""));
  if (!filename.startsWith(path.join(root, "public") + path.sep)) {
    throw new Error("Asset escapes public directory: " + source);
  }
  await stat(filename);
  const digest = createHash("sha256").update(await readFile(filename)).digest("hex");
  if (digest !== asset.sha256) throw new Error("Checksum mismatch for " + source);
}

console.log("Archive snapshot " + year + " passed privacy and asset validation.");
