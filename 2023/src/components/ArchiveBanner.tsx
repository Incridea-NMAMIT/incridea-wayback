export default function ArchiveBanner() {
  return (
    <div className="group fixed inset-x-0 top-0 z-[9999] h-10">
      <aside
        className="absolute inset-x-0 top-0 border-b border-cyan-200/30 bg-[#042f49]/95 px-3 py-2 text-center text-xs font-medium tracking-wide text-cyan-50 shadow-lg backdrop-blur transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-within:translate-y-0"
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
    </div>
  );
}
