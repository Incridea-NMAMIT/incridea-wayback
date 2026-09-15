import editions from "./editions.json";

export default function WaybackDirectory() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <section className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">Incridea wayback</p>
          <h1 className="text-4xl font-bold sm:text-6xl">Festival editions</h1>
          <p className="max-w-2xl text-white/70">Preserved public, read-only views of past Incridea festivals.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
          {editions.map((edition) => (
            <article key={edition.year} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-sm text-cyan-300">{edition.year}</p>
              <h2 className="mt-1 text-2xl font-semibold">{edition.name}</h2>
              {edition.status === "published" ? (
                <a className="mt-5 inline-block rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950" href={edition.url}>
                  Open archive
                </a>
              ) : (
                <p className="mt-5 text-sm text-white/60">Archive publication is pending its verified public-data export.</p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
