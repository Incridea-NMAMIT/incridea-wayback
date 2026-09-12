# Incridea Wayback release guide

The Incridea repositories have these independently deployable applications:

- `../incridea-client-v2/main/` is the current public website. Its repository-root Vercel deployment builds this directory by default.
- `index/` is the read-only edition directory for `wayback.incridea.in`.
- `YYYY/` is an isolated historical frontend for one festival edition. It carries its source, static assets, snapshot, and archive build rules together.

An edition build is read-only. It must not call the live API, authentication, payment, socket, analytics, upload, or other state-changing services.

## Create an edition snapshot

Restore the applicable production database backup, apply the multi-year migration, and run the exporter from `incridea-server-v2`:

    npm run archive:export -- --year 2026 --source-commit 2547606 --output ../incridea-wayback/2026/src/archive/snapshots/2026.json --assets-dir ../incridea-wayback/2026/public/archive-assets/2026

The exporter is read-only against the database. It exports allowlisted public, edition-scoped data, rejects personal fields, mirrors required image assets, and writes SHA-256 checksums into the snapshot.

Validate and build the isolated archive:

    cd ../incridea-wayback/2026
    npm ci
    npm run archive:verify -- --year 2026
    npm run build:archive -- --year 2026

Only then commit the snapshot and mirrored assets and create the immutable annotated `edition-2026` tag. Never move an edition tag after publishing.

## Deployments

The current-site repository's root `vercel.json` installs and builds `main/`, so the usual production deployment continues to publish the current festival website. This repository's root `vercel.json` builds the directory application.

Deploy the directory from `index/` and assign only `wayback.incridea.in`. Deploy an edition from `YYYY/` and assign only `YYYY.wayback.incridea.in`. The tag workflow validates these relationships and uses `--skip-domain` before the yearly alias is assigned, preventing a new edition deployment from replacing the current site, directory, or another edition.

Configure the GitHub secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` before using the tag workflow.

## DNS and Vercel setup

Keep DigitalOcean as the authoritative DNS provider.

1. Add `wayback.incridea.in` and `*.wayback.incridea.in` to the Wayback Vercel project.
2. Add the project-specific CNAME Vercel displays for the base domain and the wildcard CNAME Vercel displays for yearly hosts.
3. Delegate `_acme-challenge.wayback` with NS records to Vercel's nameservers so Vercel can issue wildcard certificates without changing the existing `incridea.in` nameservers.
4. Wait for Vercel to mark both domains configured and issue TLS.

## Release checklist

- Confirm snapshot year, directory name, source commit, tag, and hostname agree.
- Confirm every snapshot asset is local, checksummed, and has no remote URL or private field.
- Test direct and refreshed `/`, `/events`, an event detail, `/gallery`, and `/tech-team` URLs.
- Confirm transactional routes render the archive notice and no write-capable requests run.
