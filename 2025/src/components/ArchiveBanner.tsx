export default function ArchiveBanner() {
  return (
    <div className="group fixed inset-x-0 top-0 z-[9999] h-10 pointer-events-none">
      <aside
        className="pointer-events-auto absolute inset-x-0 top-0 border-b border-amber-300/40 bg-[#052d1a]/95 px-3 py-2 text-center text-xs font-medium tracking-wide text-amber-50 shadow-lg backdrop-blur transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-within:translate-y-0"
        role="status"
      >
        You are viewing the read-only Incridea 2025 archive.{" "}
        <a
          className="font-bold text-amber-300 underline decoration-amber-400 underline-offset-2 hover:text-white"
          href="https://incridea.in"
        >
          Visit the current Incridea site
        </a>
      </aside>
    </div>
  );
}
