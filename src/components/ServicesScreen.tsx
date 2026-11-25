import { useState } from 'react';
import { ArrowRight, Calendar, Check, Plus } from 'lucide-react';
import {
  ESTATE_SERVICES,
  SEASONAL_CALENDAR,
  type EstateServiceItem,
  type ServiceCategory,
} from '../data/estateData';
import {
  formatCurrency,
  type AddonId,
  type QuoteConfig,
  type ServiceTierId,
} from '../utils/quoteEngine';
import { ResilientImage } from './ResilientImage';

interface ServicesScreenProps {
  quoteConfig: QuoteConfig;
  onToggleServiceInQuote: (options: { tier?: ServiceTierId; addon?: AddonId }) => void;
  onSetFrequency: (frequency: QuoteConfig['frequency']) => void;
  onProceedToQuote: () => void;
}

const CATEGORY_TABS: { id: ServiceCategory; label: string }[] = [
  { id: 'all', label: 'All Services' },
  { id: 'turf', label: 'Turf & Mowing' },
  { id: 'seasonal', label: 'Seasonal Beds' },
  { id: 'health', label: 'Hardscape & Health' },
];

export function ServicesScreen({
  quoteConfig,
  onToggleServiceInQuote,
  onSetFrequency,
  onProceedToQuote,
}: ServicesScreenProps) {
  const [category, setCategory] = useState<ServiceCategory>('all');
  const [billingMode, setBillingMode] = useState<'per_visit' | 'annual'>(
    quoteConfig.frequency === 'weekly' ? 'annual' : 'per_visit'
  );
  const [activeSeason, setActiveSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>(
    'spring'
  );

  const filteredServices =
    category === 'all'
      ? ESTATE_SERVICES
      : ESTATE_SERVICES.filter((item) => item.category === category);

  const currentSeasonData =
    SEASONAL_CALENDAR.find((s) => s.id === activeSeason) ?? SEASONAL_CALENDAR[0];

  const handleBillingChange = (mode: 'per_visit' | 'annual') => {
    setBillingMode(mode);
    onSetFrequency(mode === 'annual' ? 'weekly' : 'onetime');
  };

  const isServiceSelected = (service: EstateServiceItem): boolean => {
    if (service.linkedAddon) {
      return quoteConfig.addons.includes(service.linkedAddon);
    }
    if (service.linkedTier) {
      return quoteConfig.tier === service.linkedTier;
    }
    return false;
  };

  const selectedCount =
    1 + quoteConfig.addons.length; // Always includes active tier + chosen add-ons

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 space-y-16">
      {/* Screen Header & Controls */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2E7D32]">
              Services &amp; Care Plans
            </p>
            <h1 className="text-[32px] leading-[38px] sm:text-[42px] sm:leading-[50px] font-extrabold tracking-[-0.03em] text-[#1B241E]">
              Precision Estate Care Without Surprises
            </h1>
            <p className="text-[16px] leading-[24px] text-[#414940]">
              Select any turf tier or seasonal add-on below to pre-load your instant
              Madison County property estimate.
            </p>
          </div>

          {/* Billing cadence segmented toggle */}
          <div
            role="group"
            aria-label="Service pricing cadence"
            className="inline-flex items-center p-1 rounded-xl bg-[#E6F1E7] self-start lg:self-auto"
          >
            <button
              type="button"
              aria-pressed={billingMode === 'per_visit'}
              onClick={() => handleBillingChange('per_visit')}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer ${
                billingMode === 'per_visit'
                  ? 'bg-white text-[#164E24] shadow-estate-1'
                  : 'text-[#414940] hover:text-[#1B241E]'
              }`}
            >
              Per Visit
            </button>
            <button
              type="button"
              aria-pressed={billingMode === 'annual'}
              onClick={() => handleBillingChange('annual')}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer ${
                billingMode === 'annual'
                  ? 'bg-[#164E24] text-white shadow-estate-1'
                  : 'text-[#414940] hover:text-[#1B241E]'
              }`}
            >
              Annual Estate Plan · Save 12%
            </button>
          </div>
        </div>

        {/* Category Filter Tabs + Selection Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#1B241E]/8">
          <div
            role="tablist"
            aria-label="Filter landscaping services"
            className="flex flex-wrap items-center gap-1.5"
          >
            {CATEGORY_TABS.map((tab) => {
              const active = category === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setCategory(tab.id)}
                  className={`px-4 py-2 rounded-lg text-[14px] font-semibold whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#164E24] text-white'
                      : 'bg-white text-[#414940] border-estate-hairline hover:text-[#1B241E]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onProceedToQuote}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F4EBD9] hover:bg-[#eadbc0] text-[#164E24] text-[14px] font-bold px-5 py-2.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <span className="tabular-nums">
              Continue to Quote ({selectedCount} {selectedCount === 1 ? 'item' : 'items'})
            </span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* SERVICE CATALOG GRID */}
      <section aria-label="Service catalog">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const selected = isServiceSelected(service);
            const displayPrice =
              billingMode === 'annual'
                ? Math.round(service.startingPrice * 0.88)
                : service.startingPrice;

            return (
              <article
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden border-estate-hairline shadow-estate-1 hover:shadow-estate-2 flex flex-col justify-between"
              >
                <div>
                  {service.popular && (
                    <div className="h-[4px] w-full bg-[#2E7D32]" aria-hidden="true" />
                  )}
                  <div className="aspect-[16/10] bg-[#E6F1E7] overflow-hidden">
                    <ResilientImage
                      src={service.image}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover"
                      fallbackTitle={service.title}
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[12px] font-semibold text-[#414940]">
                          {service.categoryLabel}
                          {service.popular ? ' · Popular Package' : ''}
                        </p>
                        <h2 className="text-[20px] font-bold text-[#1B241E] mt-1">
                          {service.title}
                        </h2>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[22px] font-extrabold tabular-nums text-[#164E24]">
                          {formatCurrency(displayPrice)}
                        </p>
                        <p className="text-[11px] font-medium text-[#71796F]">
                          {billingMode === 'annual' ? '12% plan rate' : service.unitLabel}
                        </p>
                      </div>
                    </div>

                    <p className="text-[14px] leading-[22px] text-[#414940]">
                      {service.summary}
                    </p>

                    <ul className="space-y-2 pt-1">
                      {service.deliverables.map((task) => (
                        <li
                          key={task}
                          className="flex items-start gap-2 text-[13px] text-[#1B241E]"
                        >
                          <Check
                            className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      onToggleServiceInQuote({
                        tier: service.linkedTier,
                        addon: service.linkedAddon,
                      })
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-full text-[14px] font-semibold px-5 py-3 cursor-pointer whitespace-nowrap ${
                      selected
                        ? 'bg-[#164E24] text-white shadow-estate-1'
                        : 'border-[1.5px] border-[#164E24] text-[#164E24] hover:bg-[#ECF6EC]'
                    }`}
                  >
                    {selected ? (
                      <>
                        <Check className="w-4 h-4 text-[#A0F399]" aria-hidden="true" />
                        Added to Quote
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        {service.linkedTier ? 'Select Package' : 'Add to Quote'}
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* NORTH ALABAMA SEASONAL TURF CALENDAR */}
      <section className="rounded-3xl bg-[#F4EBD9] p-6 sm:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[#164E24]">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span className="text-[11px] font-bold uppercase tracking-[0.06em]">
                North Alabama Agronomic Calendar
              </span>
            </div>
            <h2 className="text-[26px] leading-[32px] sm:text-[34px] sm:leading-[42px] font-bold tracking-[-0.02em] text-[#1B241E]">
              Year-Round Stewardship Timed to Madison County Soils
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Seasonal lawn care schedule"
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-white/80 border-estate-hairline self-start lg:self-auto"
          >
            {SEASONAL_CALENDAR.map((season) => {
              const active = season.id === activeSeason;
              return (
                <button
                  key={season.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setActiveSeason(season.id)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#164E24] text-white shadow-estate-1'
                      : 'text-[#414940] hover:text-[#1B241E]'
                  }`}
                >
                  {season.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border-estate-hairline shadow-estate-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1B241E]/8">
            <div>
              <h3 className="text-[22px] font-bold text-[#1B241E]">
                {currentSeasonData.label} Program · {currentSeasonData.months}
              </h3>
              <p className="text-[15px] text-[#414940] mt-1">{currentSeasonData.focus}</p>
            </div>
            <button
              type="button"
              onClick={onProceedToQuote}
              className="inline-flex items-center gap-2 rounded-full bg-[#164E24] hover:bg-[#003612] text-white text-[14px] font-semibold px-5 py-2.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              Build Custom Plan
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentSeasonData.tasks.map((task, idx) => (
              <div key={task.title} className="space-y-2">
                <p className="text-[12px] font-bold tabular-nums text-[#2E7D32]">
                  0{idx + 1}.
                </p>
                <h4 className="text-[17px] font-bold text-[#1B241E]">{task.title}</h4>
                <p className="text-[14px] leading-[22px] text-[#414940]">{task.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
