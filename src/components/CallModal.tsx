import { useEffect, useState } from 'react';
import { Check, Clock, Copy, MapPin, Phone, X } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartQuote: () => void;
}

const PHONE_DISPLAY = '(256) 555-0194';

export function CallModal({ isOpen, onClose, onStartQuote }: CallModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_DISPLAY);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1B241E]/45 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-estate-3 border-estate-hairline"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2E7D32] mb-1">
              Direct Estate Dispatch
            </p>
            <h2
              id="call-modal-title"
              className="text-2xl font-bold tracking-[-0.01em] text-[#1B241E]"
            >
              Speak With Our Lead Estimator
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close direct call dialog"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#414940] hover:bg-[#F9F8F6] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="rounded-2xl bg-[#F4EBD9] p-5 mb-5">
          <p className="text-[13px] font-semibold text-[#414940] mb-1">
            Huntsville &amp; Madison County Line
          </p>
          <p className="text-[28px] font-extrabold tracking-[-0.02em] tabular-nums text-[#164E24]">
            {PHONE_DISPLAY}
          </p>
          <div className="mt-3 flex flex-col gap-1.5 text-[13px] text-[#414940]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#164E24] shrink-0" aria-hidden="true" />
              <span>Mon – Sat · 7:00 AM – 6:00 PM CST</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#164E24] shrink-0" aria-hidden="true" />
              <span>Same-week on-site assessments across Madison County</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="tel:+12565550194"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#1B6D24] active:scale-[0.98] text-white text-[15px] font-semibold px-6 py-3.5 shadow-estate-1"
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            Call {PHONE_DISPLAY} Now
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 rounded-full border-[1.5px] border-[#164E24] text-[#164E24] hover:bg-[#ECF6EC] text-[14px] font-semibold px-4 py-2.5 cursor-pointer whitespace-nowrap"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#2E7D32]" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copy Number
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onStartQuote();
              }}
              className="inline-flex items-center justify-center rounded-full bg-[#164E24] hover:bg-[#003612] text-white text-[14px] font-semibold px-4 py-2.5 cursor-pointer whitespace-nowrap"
            >
              Instant Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
