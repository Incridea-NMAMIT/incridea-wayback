# Wayback snapshot helper

Create a sanitized local snapshot for an existing isolated edition:

    npm run wayback:snapshot -- 2026 2547606

The first argument is the Wayback year and the second is the immutable source
commit. Omit either to enter it interactively. The helper invokes the sibling
`incridea-server-v2` exporter using its configured database URL, then writes the
snapshot and mirrored public assets into `YYYY/` in this repository.

An existing snapshot is not replaced unless `OVERWRITE` is entered. Set
`INCRIDEA_SERVER_DIR` only if the server repository is not a sibling directory.
