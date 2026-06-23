import Link from 'next/link';

interface SectionHeadProps {
  no: string;
  kicker: string;
  title: string;
  linkHref?: string;
  linkLabel?: string;
}

/**
 * Shared section opener for the front page. A filled accent number tab with a
 * hard ink shadow (matching the zine buttons) sits beside an oversized
 * WONK-serif misprint heading, under a classic double rule.
 */
export default function SectionHead({ no, kicker, title, linkHref, linkLabel }: SectionHeadProps) {
  return (
    <div className="reveal rule-strong-t flex flex-col gap-5 pt-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-end gap-4 sm:gap-5">
        {/* Chapter thumb-index — solid accent block, reversed-out numeral */}
        <span
          className="grid h-14 w-14 shrink-0 select-none place-items-center bg-[var(--acc)] text-white shadow-[3px_3px_0_var(--ink)] md:h-16 md:w-16"
          aria-hidden="true"
        >
          <span className="mono text-2xl font-bold leading-none md:text-3xl">{no}</span>
        </span>
        <div className="-mb-1">
          <span className="folio">{kicker}</span>
          <h2 className="display misprint text-[2.1rem] leading-[0.9] text-[var(--ink)] md:text-[3.6rem]">
            {title}
          </h2>
        </div>
      </div>

      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="u-link mono shrink-0 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-soft)]"
        >
          {linkLabel} ↗
        </Link>
      )}
    </div>
  );
}
