export default function ArchiveBanner() {
  return (
    <aside
      className="fixed inset-x-0 top-0 z-[9999] border-b border-violet-200/30 bg-[#30124f]/95 px-3 py-2 text-center text-xs font-medium tracking-wide text-violet-50 shadow-lg backdrop-blur"
      role="status"
    >
      You are viewing the read-only Incridea 2024 archive.{" "}
      <a
        className="font-bold text-fuchsia-200 underline decoration-fuchsia-300 underline-offset-2 hover:text-white"
        href="https://incridea.in"
      >
        Visit the current Incridea site
      </a>
    </aside>
  );
}
