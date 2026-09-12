# Wayback applications

`index/` is the static edition directory deployed to `wayback.incridea.in`.
Each `YYYY/` folder is a fully isolated historical festival frontend. It is
built only with `VITE_ARCHIVE_YEAR=YYYY` and verifies its checked-in public
snapshot before producing deployable files.

All archive deployments prohibit browser connections through a `connect-src
'none'` content-security policy. Historical API route handlers are excluded
from the edition source; archive data is served only from checked-in snapshots
and static files.

Create a new folder from the final edition source, add the shared archive
compatibility layer, export its snapshot into
`YYYY/src/archive/snapshots/YYYY.json`, validate it, then create the matching
immutable `edition-YYYY` tag. See `docs/ARCHIVING.md` for the operator
commands and deployment process.
