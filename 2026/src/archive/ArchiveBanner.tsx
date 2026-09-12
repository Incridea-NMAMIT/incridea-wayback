import { archiveSiteUrl, archiveYear } from "./archive";

export default function ArchiveBanner() {
  if (!archiveYear) return null;

  return (
    <aside className="fixed inset-x-0 top-0 z-[100] border-b border-cyan-300/30 bg-slate-950/95 px-4 py-2 text-center text-xs text-cyan-100 backdrop-blur" role="status">
      You are viewing the read-only Incridea {archiveYear} archive.{" "}
      <a className="font-semibold underline underline-offset-2" href="https://incridea.in">
        Visit the current Incridea site
      </a>
      {archiveSiteUrl && <span className="sr-only"> at {archiveSiteUrl}</span>}
    </aside>
  );
}
