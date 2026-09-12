import { Link } from "react-router-dom";
import { archiveYear } from "./archive";

export default function ArchiveUnavailablePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 pt-16 text-center text-white">
      <section className="space-y-5 rounded-2xl border border-white/15 bg-black/50 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Incridea archive</p>
        <h1 className="text-3xl font-bold">{archiveYear ?? "This"} edition is not available yet</h1>
        <p className="text-white/75">The immutable public snapshot has not been published. No live festival services are used by this archive.</p>
        <Link className="inline-block rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950" to="/">
          Return home
        </Link>
      </section>
    </main>
  );
}
