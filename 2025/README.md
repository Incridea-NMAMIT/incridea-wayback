# Incridea 2025 Wayback

This is an isolated source snapshot of the 2025 Incridea frontend, taken from the historical `incridea-client` checkout at commit `e0fb85a` (2026-01-10).

It intentionally excludes Git metadata, local environment files, dependency directories, and build output. The bundled Apollo client is a mock client, so this archive does not make requests to, or mutate, the current event backend.

## Build

```sh
npm ci
npm run build:archive
```

Deploy this directory as the root of its own Vercel project for the 2025 Wayback host.
