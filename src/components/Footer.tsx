import type { ScreenId } from './TopBar';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenCall: () => void;
}

export function Footer({ onNavigate, onOpenCall }: FooterProps) {
  return (
    <footer className="bg-[#164E24] text-white mt-20 pb-20 sm:pb-12 pt-14">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          <div className="md:col-span-5 space-y-3">
            <p className="text-2xl font-extrabold tracking-[-0.03em] text-white">
              Estate Craft
            </p>
            <p className="text-[15px] leading-relaxed text-white/80 max-w-md">
              Architectural residential turf care, seasonal pine straw craftsmanship, and
              year-round grounds stewardship across North Alabama.
            </p>
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#D4A373] pt-1">
              Licensed &amp; Insured · Alabama Ornamental &amp; Turf Permit #AL-4918
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#D4A373]">
              Explore
            </h3>
            <ul className="space-y-2 text-[14px] text-white/85">
              {(
                [
                  { id: 'overview', label: 'Estate Overview' },
                  { id: 'services', label: 'Services & Turf Calendar' },
                  { id: 'portfolio', label: 'Before & After Portfolio' },
                  { id: 'quote', label: 'Instant Property Quote' },
                ] as const
              ).map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.id)}
                    className="hover:text-white underline-offset-4 hover:underline cursor-pointer"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#D4A373]">
              North Alabama Dispatch
            </h3>
            <p className="text-[14px] text-white/85">
              Huntsville · Madison · Hampton Cove · Monte Sano · Jones Valley · Owens Cross Roads
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onOpenCall}
                className="text-[15px] font-bold tabular-nums text-white hover:text-[#D4A373] cursor-pointer"
              >
                (256) 555-0194
              </button>
              <span className="text-white/40" aria-hidden="true">
                ·
              </span>
              <span className="text-[14px] text-white/80">estimates@estatecraftal.com</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] text-white/65">
          <p>© {new Date().getFullYear()} Estate Craft Grounds Management LLC. Huntsville, AL.</p>
          <p>Mon – Sat, 7:00 AM – 6:00 PM CST · 100% Curbside Satisfaction Guarantee</p>
        </div>
      </div>
    </footer>
  );
}
