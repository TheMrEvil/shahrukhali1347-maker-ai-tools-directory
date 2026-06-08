import { aiTools } from '@/data/tools';
import { getAccent, getInitials } from '@/lib/accent';

export default function ToolMarquee() {
  // Pick a varied subset (every Nth + the trending/featured)
  const subset = aiTools.slice(0, 24);
  const doubled = [...subset, ...subset];

  return (
    <section className="relative border-y border-[var(--border)] bg-[var(--bg)] py-7">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
        Featured across the directory
      </p>
      <div className="marquee-mask mt-5 overflow-hidden">
        <div className="anim-marquee flex w-max gap-3 pr-3">
          {doubled.map((t, i) => {
            const accent = getAccent(t.name);
            return (
              <a
                key={`${t.id}-${i}`}
                href={`/tools/${t.slug}`}
                className="lift inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm transition hover:border-[var(--brand)]"
              >
                <span
                  className="grid h-6 w-6 place-items-center rounded-md text-[10px] font-bold"
                  style={{ background: accent.tile, color: accent.text, border: `1px solid ${accent.ring}` }}
                >
                  {getInitials(t.name)}
                </span>
                <span className="font-medium text-[var(--fg)]">{t.name}</span>
                <span className="text-[var(--muted)]">·</span>
                <span className="hidden text-xs text-[var(--fg-soft)] sm:inline line-clamp-1 max-w-[180px]">
                  {t.tagline}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
