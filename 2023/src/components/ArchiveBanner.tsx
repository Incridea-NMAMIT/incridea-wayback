export default function ArchiveBanner() {
  return (
    <aside
      className="fixed inset-x-0 top-0 z-[9999] border-b border-cyan-200/30 bg-[#042f49]/95 px-3 py-2 text-center text-xs font-medium tracking-wide text-cyan-50 shadow-lg backdrop-blur"
      role="status"
    >
      You are viewing the read-only Incridea 2023 archive.{" "}
      <a
        className="font-bold text-cyan-200 underline decoration-cyan-300 underline-offset-2 hover:text-white"
        href="https://incridea.in"
      >
        Visit the current Incridea site
      </a>
    </aside>
  );
}
