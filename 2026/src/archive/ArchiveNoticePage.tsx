import { Link } from "react-router-dom";

export default function ArchiveNoticePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 pt-16 text-center text-white">
      <section className="space-y-5 rounded-2xl border border-white/15 bg-black/50 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Read-only archive</p>
        <h1 className="text-3xl font-bold">This is just a snapshot</h1>
        <p className="text-white/75">Data is not available for this archived view.</p>
        <Link className="inline-block rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950" to="/">
          Browse the archive
        </Link>
      </section>
    </main>
  );
}
