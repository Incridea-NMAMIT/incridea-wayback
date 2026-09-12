import { spawnSync } from "node:child_process";

const year = process.argv[process.argv.indexOf("--year") + 1];
if (!/^[0-9]{4}$/.test(year ?? "")) {
  throw new Error("Usage: npm run build:archive -- --year YYYY");
}

const verify = spawnSync(process.execPath, ["scripts/archive-verify.mjs", "--year", year], {
  stdio: "inherit",
});
if (verify.status !== 0) process.exit(verify.status ?? 1);

const build = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  env: { ...process.env, VITE_ARCHIVE_YEAR: year },
});
process.exit(build.status ?? 1);
