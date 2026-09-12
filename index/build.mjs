import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

const editions = JSON.parse(
  await readFile(new URL("./editions.json", import.meta.url), "utf8"),
);
const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const cards = editions
  .map((edition, index) => {
    const details =
      '<span class="card-number">' +
      String(index + 1).padStart(2, "0") +
      '</span><span class="year">' +
      escapeHtml(edition.year) +
      "</span><h2>" +
      escapeHtml(edition.name) +
      "</h2>";
    return edition.status === "published"
      ? '<a class="edition-card published" href="' +
          escapeHtml(edition.url) +
          '" aria-label="Open ' +
          escapeHtml(edition.name) +
          ' archive">' +
          details +
          '<span class="card-footer">Enter archive <span aria-hidden="true">↗</span></span></a>'
      : '<article class="edition-card pending" aria-label="' +
          escapeHtml(edition.name) +
          ' archive, coming soon">' +
          details +
          '<span class="card-footer">Preparing records <span class="orbit-dot" aria-hidden="true"></span></span></article>';
  })
  .join("");

const publishedYears = editions
  .filter((edition) => edition.status === "published")
  .map((edition) => String(edition.year));

const styles =
  '@font-face{font-family:Trap;src:local("Trap"),local("Trap-Regular");font-display:swap}' +
  ':root{color-scheme:dark;--ink:#edf2ff;--muted:#abb7d3;--line:rgba(231,204,149,.28);--gold:#eccb8a}' +
  '*{box-sizing:border-box}html,body{height:100%;overflow:hidden}' +
  'body{min-width:320px;margin:0;background:#080b17;color:var(--ink);font-family:"DM Mono",ui-monospace,monospace}' +
  'body:before{content:"";position:fixed;inset:0;z-index:-2;background:linear-gradient(90deg,rgba(4,6,14,.58),rgba(4,6,14,.12) 50%,rgba(4,6,14,.58)),url("/wayback-hero.png") center/cover no-repeat}' +
  'body:after{content:"";position:fixed;inset:0;z-index:-1;opacity:.21;background-image:linear-gradient(rgba(255,255,255,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.055) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to bottom,black,transparent 85%)}' +
  '.shell{width:min(1180px,calc(100% - 40px));height:100svh;margin:auto;padding:clamp(18px,3vh,34px) 0 clamp(16px,3vh,28px);display:flex;flex-direction:column;overflow:hidden}' +
  '.topline{display:flex;align-items:center;justify-content:space-between;color:#d8c393;font-size:10px;letter-spacing:.2em;text-transform:uppercase}.mark{display:flex;gap:10px;align-items:center}.mark i{width:10px;height:10px;border:1px solid var(--gold);border-radius:50%;box-shadow:0 0 18px #e7bb70}.topline span:last-child{color:var(--muted)}' +
  '.hero{padding:clamp(44px,9vh,100px) 0 clamp(24px,4vh,46px);max-width:770px}.eyebrow{margin:0 0 15px;color:var(--gold);font-size:10px;letter-spacing:.22em;text-transform:uppercase}.eyebrow:before{content:"";display:inline-block;width:34px;height:1px;margin:0 10px 4px 0;background:currentColor}' +
  '.hero h1{max-width:730px;margin:0;font:600 clamp(42px,7vw,88px)/.92 Trap,"Arial Black",sans-serif;letter-spacing:-.055em;text-wrap:balance}.hero h1 em{color:#ecd7a7;font-weight:600}.hero-copy{max-width:510px;margin:17px 0 0;color:var(--muted);font:400 12px/1.75 ui-monospace,monospace}' +
  '.archive{min-height:0;display:flex;flex-direction:column}.archive-heading{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:13px}.archive-heading h2{margin:0;font:600 clamp(20px,3vw,29px)/1.1 Trap,"Arial Black",sans-serif}.archive-heading p{max-width:265px;margin:0;color:var(--muted);font-size:10px;line-height:1.5;text-align:right}' +
  '.carousel{display:flex;gap:12px;overflow-x:auto;padding:0 2px 10px;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:rgba(236,203,138,.5) transparent}.edition-card{position:relative;flex:0 0 min(228px,67vw);min-height:176px;overflow:hidden;display:flex;flex-direction:column;padding:18px;border:1px solid var(--line);border-radius:3px;background:linear-gradient(145deg,rgba(23,30,55,.88),rgba(6,9,20,.74));box-shadow:0 16px 38px rgba(0,0,0,.23);color:var(--ink);text-decoration:none;scroll-snap-align:start;transition:transform .25s ease,border-color .25s ease,background .25s ease}.edition-card:before{content:"";position:absolute;inset:8px;border:1px solid rgba(255,255,255,.06);pointer-events:none}.published:hover{transform:translateY(-4px);border-color:var(--gold);background:linear-gradient(145deg,rgba(34,42,72,.94),rgba(8,12,26,.8))}.pending{filter:saturate(.55);opacity:.78}' +
  '.card-number{color:#93a6d6;font-size:9px;letter-spacing:.16em}.year{margin-top:auto;color:#f0dba9;font:600 clamp(39px,5vw,56px)/.9 Trap,"Arial Black",sans-serif;letter-spacing:-.06em}.edition-card h2{position:relative;z-index:1;margin:7px 0 0;font:500 17px/1.15 Trap,"Arial Black",sans-serif}.card-footer{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:14px;padding-top:10px;border-top:1px solid rgba(233,204,150,.2);color:#d8c393;font-size:9px;letter-spacing:.08em;text-transform:uppercase}.card-footer span{font-size:15px}.orbit-dot{width:7px;height:7px;border:1px solid #d8c393;border-radius:50%;box-shadow:0 0 0 4px rgba(216,195,147,.1)}' +
  '.footnote{display:flex;justify-content:space-between;gap:20px;margin-top:auto;padding-top:15px;border-top:1px solid rgba(255,255,255,.12);color:#8290b2;font-size:9px;line-height:1.5}.footnote strong{color:#bec8e3;font-weight:500}@media(max-width:600px){.shell{width:min(100% - 28px,1180px)}.topline span:last-child,.footnote{display:none}.hero{padding:clamp(42px,9vh,70px) 0 24px}.hero h1{font-size:clamp(41px,13vw,62px)}.hero-copy{font-size:11px}.archive-heading{display:block}.archive-heading p{display:none}.edition-card{flex-basis:min(205px,72vw);min-height:158px}.carousel{padding-bottom:4px}}@media(max-height:650px) and (min-width:601px){.hero{padding:28px 0 20px}.hero-copy{display:none}.edition-card{min-height:145px}.footnote{display:none}}';

const html =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#080b17"><title>Incridea Wayback</title><style>' +
  styles +
  '</style></head><body><main class="shell" id="app"><header class="topline"><span class="mark"><i></i> Incridea / Wayback</span><span>Preserved festival records</span></header><section class="hero"><p class="eyebrow">The archive is open</p><h1>A time portal to Incridea’s <em>unforgettable chapters.</em></h1><p class="hero-copy">Step into preserved, read-only editions of Incridea—each one a record of the people, events and ideas that moved through it.</p></section><section class="archive" aria-labelledby="edition-heading"><div class="archive-heading"><h2 id="edition-heading">Select an edition</h2><p>Swipe through the preserved festival years.</p></div><div class="carousel">' +
  cards +
  '</div></section><footer class="footnote"><p><strong>INCRIDEA WAYBACK</strong><br>NMAM Institute of Technology</p><p>Public archive · Versioned by year</p></footer></main><script>const years=' +
  JSON.stringify(publishedYears) +
  ';const match=location.hostname.match(/^(\\d{4})\\.wayback\\.incridea\\.in$/);if(match&&!years.includes(match[1])){document.title="Archive not found | Incridea Wayback";document.getElementById("app").innerHTML="<main class=\\"shell\\"><section class=\\"hero\\"><p class=\\"eyebrow\\">No public record</p><h1>That archive is <em>not here.</em></h1><p class=\\"hero-copy\\">No published edition matches this address.</p></section></main>"}</script></body></html>';

await mkdir(new URL("./dist/", import.meta.url), { recursive: true });
await copyFile(
  new URL("./assets/wayback-hero.png", import.meta.url),
  new URL("./dist/wayback-hero.png", import.meta.url),
);
await writeFile(new URL("./dist/index.html", import.meta.url), html);
