import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { clampComparisonPercent } from '../utils/quoteEngine';
import { ResilientImage } from './ResilientImage';

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  projectTitle: string;
  initialPercent?: number;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  projectTitle,
  initialPercent = 50,
}: BeforeAfterSliderProps) {
  const [percent, setPercent] = useState<number>(() => clampComparisonPercent(initialPercent));
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPercent(clampComparisonPercent(raw));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPercent((prev) => clampComparisonPercent(prev - 5));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPercent((prev) => clampComparisonPercent(prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPercent(10);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPercent(90);
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        data-testid="before-after-frame"
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[480px] rounded-2xl overflow-hidden select-none touch-none bg-[#E6F1E7] border-estate-hairline shadow-estate-1 cursor-ew-resize"
      >
        {/* Base layer: AFTER image */}
        <ResilientImage
          src={afterSrc}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          fallbackTitle={`${projectTitle} — After`}
        />

        {/* Clipped overlay: BEFORE image */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        >
          <ResilientImage
            src={beforeSrc}
            alt={beforeAlt}
            className="w-full h-full object-cover"
            fallbackTitle={`${projectTitle} — Before`}
          />
        </div>

        {/* Measured top labels with high-contrast scrim */}
        <div className="absolute top-3.5 left-3.5 pointer-events-none px-3 py-1 rounded-full bg-[#1B241E]/80 text-white text-[12px] font-semibold tracking-[0.02em] backdrop-blur-xs">
          Before
        </div>
        <div className="absolute top-3.5 right-3.5 pointer-events-none px-3 py-1 rounded-full bg-[#164E24]/90 text-white text-[12px] font-semibold tracking-[0.02em] backdrop-blur-xs">
          After · Estate Craft
        </div>

        {/* Tactile Sandstone Soil (#D4A373) center divider & rounded drag handle */}
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Compare before and after for ${projectTitle}`}
          aria-valuemin={5}
          aria-valuemax={95}
          aria-valuenow={percent}
          aria-valuetext={`${percent}% before view`}
          onKeyDown={handleKeyDown}
          style={{ left: `${percent}%` }}
          className="absolute top-0 bottom-0 -translate-x-1/2 w-1 bg-[#D4A373] shadow-[0_0_12px_rgba(27,36,30,0.35)] focus-visible:outline-none group"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#D4A373] border-[3px] border-white text-[#1B241E] flex items-center justify-center shadow-estate-3 group-hover:scale-105 group-focus-visible:ring-4 group-focus-visible:ring-[#164E24]/35 transition-transform">
            <MoveHorizontal className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Tactile comparison position controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-[13px] font-medium text-[#414940] tabular-nums">
          Drag sandstone handle or use keys · Showing{' '}
          <span className="font-semibold text-[#1B241E]">{percent}% Before</span> /{' '}
          <span className="font-semibold text-[#164E24]">{100 - percent}% After</span>
        </p>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#E6F1E7]">
          {[
            { label: 'Focus After', value: 18 },
            { label: '50 / 50 Split', value: 50 },
            { label: 'Focus Before', value: 82 },
          ].map((preset) => {
            const active = Math.abs(percent - preset.value) <= 4;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPercent(preset.value)}
                className={`px-3 py-1.5 text-[12px] font-semibold rounded-md whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-white text-[#164E24] shadow-estate-1'
                    : 'text-[#414940] hover:text-[#1B241E]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
