import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type ScreenId = 'overview' | 'services' | 'portfolio' | 'quote';

interface TopBarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  savedCount: number;
}

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'quote', label: 'Instant Quote' },
];

export function TopBar({ activeScreen, onNavigate, savedCount }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (screen: ScreenId) => {
    setMobileMenuOpen(false);
    onNavigate(screen);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#1B241E]/8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-14 md:h-[72px] flex items-center justify-between gap-8">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => handleSelect('overview')}
          className="text-xl md:text-[22px] font-extrabold tracking-[-0.03em] text-[#164E24] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E24] focus-visible:ring-offset-2 rounded-md"
        >
          Estate Craft
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleSelect(item.id)}
                className={`relative py-2 text-[15px] font-semibold tracking-[0.01em] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E24] focus-visible:ring-offset-2 rounded-sm ${
                  isActive
                    ? 'text-[#164E24]'
                    : 'text-[#414940] hover:text-[#1B241E]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full transition-opacity ${
                    isActive ? 'bg-[#164E24] opacity-100' : 'bg-[#164E24]/30 opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('quote')}
            className="hidden md:inline-flex items-center justify-center rounded-full bg-[#164E24] hover:bg-[#003612] active:scale-[0.98] text-white text-[15px] font-semibold tracking-[0.01em] px-6 py-2.5 whitespace-nowrap shrink-0 cursor-pointer shadow-estate-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E24] focus-visible:ring-offset-2"
          >
            Book Estimate
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#1B241E] hover:bg-[#E1EBE1]/60 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164E24]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden bg-white border-t border-[#1B241E]/8 px-4 py-3 shadow-estate-2"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-[15px] font-semibold cursor-pointer ${
                    isActive
                      ? 'bg-[#ECF6EC] text-[#164E24]'
                      : 'text-[#1B241E] hover:bg-[#F9F8F6]'
                  }`}
                >
                  {item.label}
                  {item.id === 'quote' && savedCount > 0 ? ` (${savedCount})` : ''}
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
