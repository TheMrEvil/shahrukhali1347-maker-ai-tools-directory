import {
  MessagesSquare,
  Code2,
  Gift,
  Rocket,
  Bot,
  GraduationCap,
  Image as ImageIcon,
  type LucideIcon,
} from 'lucide-react';

// Distinct watermark icons so no two posts share a mark.
const WATERMARK_ICONS: Record<string, LucideIcon> = {
  chat: MessagesSquare,
  code: Code2,
  free: Gift,
  startup: Rocket,
  agent: Bot,
  guide: GraduationCap,
  image: ImageIcon,
};

interface GuideCoverProps {
  title: string;
  no: number;
  kicker?: string;
  logo?: string;
  iconName?: string;
  size?: 'card' | 'lead';
  section?: string;
}

/**
 * Branded editorial cover — one fixed composition, headline + topic mark swap
 * per post. The headline is vertically centred so the plate reads as a
 * typographic cover (no dead space), and the related tool's logo sits behind it
 * as a large faint grayscale watermark for topic texture — not a stark tile.
 */
export default function GuideCover({
  title,
  no,
  kicker,
  logo,
  iconName,
  size = 'card',
  section = 'Field Notes',
}: GuideCoverProps) {
  const lead = size === 'lead';
  const WatermarkIcon = iconName ? WATERMARK_ICONS[iconName] : undefined;
  return (
    <div
      className={`cropmarks relative flex flex-col justify-center overflow-hidden border-b border-[var(--rule)] bg-[var(--paper-2)] ${
        lead ? 'aspect-[3/1] px-8 py-10' : 'aspect-[16/8] px-5 py-6'
      }`}
    >
      <div className="flag absolute inset-x-0 top-0" aria-hidden="true" />

      {/* Masthead strip */}
      <div
        className={`absolute inset-x-0 top-0 flex items-center justify-between ${
          lead ? 'px-8 pt-4' : 'px-5 pt-3'
        }`}
      >
        <span className="mono text-[8px] uppercase tracking-[0.2em] text-[var(--ink-faint)]">
          Best AI Tools · {section}
        </span>
        <span className="folio text-[8px]">№ {String(no).padStart(2, '0')}</span>
      </div>

      {/* Topic watermark — a distinct icon per post, else the tool logo */}
      {WatermarkIcon ? (
        <WatermarkIcon
          aria-hidden="true"
          strokeWidth={1.1}
          className={`pointer-events-none absolute text-[var(--ink)] opacity-[0.10] ${
            lead ? '-bottom-10 -right-6 h-44 w-44' : '-bottom-6 -right-4 h-28 w-28'
          }`}
        />
      ) : logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          aria-hidden="true"
          className={`pointer-events-none absolute object-contain opacity-[0.12] grayscale ${
            lead ? '-bottom-10 -right-8 h-48 w-48' : '-bottom-7 -right-5 h-32 w-32'
          }`}
        />
      ) : null}

      {/* Centred headline */}
      <div className="relative">
        {kicker && (
          <p className={`folio mb-1.5 ${lead ? 'text-[10px]' : 'text-[8px]'}`}>{kicker}</p>
        )}
        <h3
          className={`display text-balance leading-[1.02] text-[var(--ink)] ${
            lead ? 'text-4xl md:text-6xl' : 'text-[1.5rem]'
          }`}
        >
          {title}
        </h3>
      </div>

      <div className="halftone absolute inset-x-0 bottom-0 h-7" aria-hidden="true" />
      <span className="crop-br" aria-hidden="true" />
    </div>
  );
}
