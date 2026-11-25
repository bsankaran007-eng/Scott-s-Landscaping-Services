import { Phone } from 'lucide-react';
import type { ScreenId } from './TopBar';

interface MobileActionBarProps {
  activeScreen: ScreenId;
  onOpenCall: () => void;
  onNavigateQuote: () => void;
}

export function MobileActionBar({
  activeScreen,
  onOpenCall,
  onNavigateQuote,
}: MobileActionBarProps) {
  return (
    <div
      aria-label="Quick contact actions"
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#1B241E]/10 px-4 h-14 flex items-center gap-3 shadow-estate-3"
    >
      <button
        type="button"
        onClick={onOpenCall}
        className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#2E7D32] active:scale-[0.98] text-white text-[14px] font-semibold h-10 px-4 whitespace-nowrap cursor-pointer"
      >
        <Phone className="w-4 h-4" aria-hidden="true" />
        Call Now
      </button>

      <button
        type="button"
        onClick={onNavigateQuote}
        className="flex-1 inline-flex items-center justify-center rounded-full bg-[#164E24] active:scale-[0.98] text-white text-[14px] font-semibold h-10 px-4 whitespace-nowrap cursor-pointer"
      >
        {activeScreen === 'quote' ? 'Review Quote' : 'Instant Quote'}
      </button>
    </div>
  );
}
