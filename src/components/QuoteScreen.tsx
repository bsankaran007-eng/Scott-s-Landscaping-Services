import { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Check,
  CheckCircle2,
  ClipboardList,
  Phone,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { NORTH_ALABAMA_AREAS } from '../data/estateData';
import {
  ADDON_OPTIONS,
  FREQUENCY_CONFIG,
  SERVICE_TIERS,
  calculateQuote,
  clampAcres,
  formatCurrency,
  formatPhoneNumber,
  generateConfirmationCode,
  validateContactForm,
  type AddonId,
  type FrequencyId,
  type QuoteConfig,
  type QuoteContactForm,
  type SavedEstimate,
  type ServiceTierId,
  type ValidationErrors,
} from '../utils/quoteEngine';

interface QuoteScreenProps {
  config: QuoteConfig;
  onChangeConfig: (next: QuoteConfig) => void;
  savedEstimates: SavedEstimate[];
  onSaveEstimate: (estimate: SavedEstimate) => void;
  onCancelEstimate: (id: string) => void;
  onDeleteEstimate: (id: string) => void;
  onLoadEstimateIntoForm: (estimate: SavedEstimate) => void;
  onOpenCall: () => void;
}

const ACRE_PRESETS = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0];

function getDefaultDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().slice(0, 10);
}

const INITIAL_CONTACT: QuoteContactForm = {
  fullName: '',
  streetAddress: '',
  neighborhood: NORTH_ALABAMA_AREAS[0],
  phone: '',
  email: '',
  preferredDate: getDefaultDate(),
  hasGateAccess: false,
  hasPetsOnProperty: false,
  notes: '',
};

export function QuoteScreen({
  config,
  onChangeConfig,
  savedEstimates,
  onSaveEstimate,
  onCancelEstimate,
  onDeleteEstimate,
  onLoadEstimateIntoForm,
  onOpenCall,
}: QuoteScreenProps) {
  const [activeTab, setActiveTab] = useState<'configure' | 'saved'>('configure');
  const [acresInput, setAcresInput] = useState<string>(config.acres.toFixed(2));
  const [contact, setContact] = useState<QuoteContactForm>(INITIAL_CONTACT);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submittedEstimate, setSubmittedEstimate] = useState<SavedEstimate | null>(null);

  const breakdown = useMemo(() => calculateQuote(config), [config]);

  const setAcres = (nextValue: number) => {
    const clamped = clampAcres(nextValue);
    setAcresInput(clamped.toFixed(2));
    onChangeConfig({ ...config, acres: clamped });
  };

  const handleAcresInputChange = (raw: string) => {
    setAcresInput(raw);
    const parsed = Number.parseFloat(raw);
    if (Number.isFinite(parsed) && parsed >= 0.15 && parsed <= 3.5) {
      onChangeConfig({ ...config, acres: Math.round(parsed * 100) / 100 });
    }
  };

  const handleAcresBlur = () => {
    const parsed = Number.parseFloat(acresInput);
    setAcres(Number.isFinite(parsed) ? parsed : config.acres);
  };

  const toggleAddon = (addonId: AddonId) => {
    const exists = config.addons.includes(addonId);
    const nextAddons = exists
      ? config.addons.filter((id) => id !== addonId)
      : [...config.addons, addonId];
    onChangeConfig({ ...config, addons: nextAddons });
  };

  const updateContact = <K extends keyof QuoteContactForm>(
    field: K,
    value: QuoteContactForm[K]
  ) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(contact);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const now = Date.now();
    const newEstimate: SavedEstimate = {
      id: `est-${now}`,
      confirmationCode: generateConfirmationCode(now),
      createdAt: new Date(now).toISOString(),
      status: 'Scheduled',
      config: { ...config, addons: [...config.addons] },
      breakdown,
      contact: { ...contact },
    };

    onSaveEstimate(newEstimate);
    setSubmittedEstimate(newEstimate);
    setErrors({});
  };

  const handleStartNewQuote = () => {
    setSubmittedEstimate(null);
    setContact({ ...INITIAL_CONTACT, preferredDate: getDefaultDate() });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 space-y-8">
      {/* Screen Header & View Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2E7D32]">
            Instant Acreage Estimator
          </p>
          <h1 className="text-[32px] leading-[38px] sm:text-[42px] sm:leading-[50px] font-extrabold tracking-[-0.03em] text-[#1B241E]">
            Configure Your Property Estimate
          </h1>
          <p className="text-[16px] leading-[24px] text-[#414940]">
            Calculate live pricing by lot acreage, turf tier, and seasonal add-ons—then
            reserve your complimentary Madison County walkthrough.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Quote screen views"
          className="inline-flex items-center p-1 rounded-xl bg-[#E6F1E7] self-start md:self-auto"
        >
          <button
            role="tab"
            type="button"
            aria-selected={activeTab === 'configure'}
            onClick={() => setActiveTab('configure')}
            className={`px-4 py-2.5 rounded-lg text-[14px] font-semibold whitespace-nowrap cursor-pointer ${
              activeTab === 'configure'
                ? 'bg-white text-[#164E24] shadow-estate-1'
                : 'text-[#414940] hover:text-[#1B241E]'
            }`}
          >
            New Property Quote
          </button>
          <button
            role="tab"
            type="button"
            aria-selected={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2.5 rounded-lg text-[14px] font-semibold whitespace-nowrap cursor-pointer tabular-nums ${
              activeTab === 'saved'
                ? 'bg-[#164E24] text-white shadow-estate-1'
                : 'text-[#414940] hover:text-[#1B241E]'
            }`}
          >
            Saved Estimates ({savedEstimates.length})
          </button>
        </div>
      </div>

      {activeTab === 'configure' ? (
        submittedEstimate ? (
          /* CONFIRMED ESTIMATE STATE */
          <section
            aria-live="polite"
            className="bg-white rounded-3xl p-6 sm:p-10 border-estate-hairline shadow-estate-2 max-w-3xl mx-auto space-y-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ECF6EC] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#2E7D32]" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2E7D32]">
                  Assessment Reserved
                </p>
                <h2 className="text-[26px] font-bold tracking-[-0.02em] text-[#1B241E] mt-0.5">
                  Thank you, {submittedEstimate.contact.fullName}
                </h2>
                <p className="text-[15px] text-[#414940] mt-1">
                  Confirmation{' '}
                  <strong className="font-extrabold tabular-nums text-[#164E24]">
                    {submittedEstimate.confirmationCode}
                  </strong>{' '}
                  is saved to your estimates. Our Huntsville lead estimator will confirm your{' '}
                  <span className="font-semibold text-[#1B241E]">
                    {submittedEstimate.contact.preferredDate}
                  </span>{' '}
                  walkthrough window.
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-[#F4EBD9] p-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <p className="text-[12px] font-semibold text-[#414940]">Property</p>
                <p className="text-[15px] font-bold text-[#1B241E] mt-0.5">
                  {submittedEstimate.contact.streetAddress}
                </p>
                <p className="text-[13px] text-[#414940]">
                  {submittedEstimate.contact.neighborhood} ·{' '}
                  {submittedEstimate.config.acres.toFixed(2)} ac
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#414940]">Selected Plan</p>
                <p className="text-[15px] font-bold text-[#1B241E] mt-0.5">
                  {SERVICE_TIERS[submittedEstimate.config.tier].name}
                </p>
                <p className="text-[13px] text-[#414940]">
                  {FREQUENCY_CONFIG[submittedEstimate.config.frequency].label}
                </p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#414940]">
                  Estimated Per Visit
                </p>
                <p className="text-[28px] font-extrabold tabular-nums text-[#164E24]">
                  {formatCurrency(submittedEstimate.breakdown.perVisitTotal)}
                </p>
                {submittedEstimate.breakdown.monthlyEstimate !== null && (
                  <p className="text-[12px] font-semibold tabular-nums text-[#414940]">
                    Est. {formatCurrency(submittedEstimate.breakdown.monthlyEstimate)} / mo
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('saved')}
                className="inline-flex items-center gap-2 rounded-full bg-[#164E24] hover:bg-[#003612] text-white text-[15px] font-semibold px-6 py-3 cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" aria-hidden="true" />
                View Saved Estimates ({savedEstimates.length})
              </button>
              <button
                type="button"
                onClick={handleStartNewQuote}
                className="inline-flex items-center rounded-full border-[1.5px] border-[#164E24] text-[#164E24] hover:bg-[#ECF6EC] text-[14px] font-semibold px-6 py-3 cursor-pointer"
              >
                Configure Another Property
              </button>
            </div>
          </section>
        ) : (
          /* LIVE CONFIGURATOR + STICKY ESTIMATE SUMMARY */
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Configurator Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Lot Size (Acreage) */}
              <section className="bg-white rounded-2xl p-6 sm:p-7 border-estate-hairline shadow-estate-1 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold text-[#2E7D32] tabular-nums">
                      01. Lot Size
                    </p>
                    <h2 className="text-[20px] font-bold text-[#1B241E]">
                      Approximate Lawn Acreage
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <label htmlFor="acreage-input" className="sr-only">
                      Property lot size in acres
                    </label>
                    <input
                      id="acreage-input"
                      type="text"
                      inputMode="decimal"
                      value={acresInput}
                      onChange={(e) => handleAcresInputChange(e.target.value)}
                      onBlur={handleAcresBlur}
                      className="estate-input w-24 px-3 py-2 text-right text-[18px] font-extrabold tabular-nums text-[#164E24]"
                    />
                    <span className="text-[14px] font-semibold text-[#414940]">acres</span>
                  </div>
                </div>

                <div>
                  <input
                    type="range"
                    min={0.15}
                    max={3.5}
                    step={0.05}
                    value={config.acres}
                    aria-label="Adjust property acreage slider"
                    onChange={(e) => setAcres(Number.parseFloat(e.target.value))}
                    className="estate-range w-full"
                  />
                  <div className="flex justify-between text-[12px] font-medium tabular-nums text-[#71796F] mt-1.5">
                    <span>0.15 ac</span>
                    <span>1.00 ac</span>
                    <span>2.25 ac</span>
                    <span>3.50 ac</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ACRE_PRESETS.map((preset) => {
                    const active = Math.abs(config.acres - preset) < 0.01;
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setAcres(preset)}
                        className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold tabular-nums cursor-pointer ${
                          active
                            ? 'bg-[#164E24] text-white'
                            : 'bg-[#F9F8F6] text-[#1B241E] border-estate-hairline hover:bg-[#ECF6EC]'
                        }`}
                      >
                        {preset.toFixed(2)} ac
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Step 2: Care Package Tier (Custom 20px Radio Controls) */}
              <section className="bg-white rounded-2xl p-6 sm:p-7 border-estate-hairline shadow-estate-1 space-y-5">
                <div>
                  <p className="text-[12px] font-bold text-[#2E7D32] tabular-nums">
                    02. Estate Care Tier
                  </p>
                  <h2 className="text-[20px] font-bold text-[#1B241E]">
                    Select Maintenance Scope
                  </h2>
                </div>

                <div role="radiogroup" aria-label="Estate care tier" className="space-y-3">
                  {(Object.keys(SERVICE_TIERS) as ServiceTierId[]).map((tierKey) => {
                    const tier = SERVICE_TIERS[tierKey];
                    const selected = config.tier === tier.id;
                    return (
                      <label
                        key={tier.id}
                        className={`block rounded-2xl p-4 sm:p-5 cursor-pointer border transition-all ${
                          selected
                            ? 'bg-[#F2FCF2] border-[#164E24] shadow-estate-1'
                            : 'bg-white border-[#1B241E]/12 hover:border-[#164E24]/40'
                        } ${tier.popular ? 'border-t-[3px] border-t-[#2E7D32]' : ''}`}
                      >
                        <div className="flex items-start gap-3.5">
                          <input
                            type="radio"
                            name="service-tier"
                            value={tier.id}
                            checked={selected}
                            onChange={() => onChangeConfig({ ...config, tier: tier.id })}
                            className="sr-only"
                          />
                          {/* Custom 20px circular radio */}
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                              selected
                                ? 'bg-[#164E24] border-[#164E24]'
                                : 'bg-white border-[#71796F]'
                            }`}
                          >
                            {selected && <span className="w-2 h-2 rounded-full bg-white" />}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="text-[16px] font-bold text-[#1B241E]">
                                {tier.name}
                                {tier.popular && (
                                  <span className="ml-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#2E7D32]">
                                    Most Popular
                                  </span>
                                )}
                              </span>
                              <span className="text-[15px] font-extrabold tabular-nums text-[#164E24]">
                                From {formatCurrency(tier.baseRate)}
                              </span>
                            </div>
                            <p className="text-[13px] text-[#414940] mt-1">{tier.tagline}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Step 3: Service Cadence & Seasonal Add-on Toggle Chips */}
              <section className="bg-white rounded-2xl p-6 sm:p-7 border-estate-hairline shadow-estate-1 space-y-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-[12px] font-bold text-[#2E7D32] tabular-nums">
                      03. Schedule Cadence
                    </p>
                    <h2 className="text-[20px] font-bold text-[#1B241E]">
                      Visit Frequency
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(Object.keys(FREQUENCY_CONFIG) as FrequencyId[]).map((freqKey) => {
                      const freq = FREQUENCY_CONFIG[freqKey];
                      const active = config.frequency === freqKey;
                      return (
                        <button
                          key={freqKey}
                          type="button"
                          aria-pressed={active}
                          onClick={() => onChangeConfig({ ...config, frequency: freqKey })}
                          className={`rounded-xl px-4 py-3 text-left border cursor-pointer ${
                            active
                              ? 'bg-[#164E24] text-white border-[#164E24] shadow-estate-1'
                              : 'bg-white text-[#1B241E] border-[#1B241E]/12 hover:border-[#164E24]/40'
                          }`}
                        >
                          <p className="text-[14px] font-bold">{freq.shortLabel}</p>
                          <p
                            className={`text-[12px] mt-0.5 ${
                              active ? 'text-[#A0F399]' : 'text-[#414940]'
                            }`}
                          >
                            {freq.discountRate > 0
                              ? `Save ${Math.round(freq.discountRate * 100)}% per visit`
                              : 'Single visit service'}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add-ons Toggle Chips (0.5rem radius, #164E24 selected with green check) */}
                <div className="space-y-3 pt-4 border-t border-[#1B241E]/8">
                  <div>
                    <p className="text-[12px] font-bold text-[#2E7D32] tabular-nums">
                      04. Seasonal Add-ons
                    </p>
                    <h2 className="text-[20px] font-bold text-[#1B241E]">
                      Optional Property Enhancements
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {ADDON_OPTIONS.map((addon) => {
                      const active = config.addons.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleAddon(addon.id)}
                          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-[14px] font-semibold border cursor-pointer whitespace-nowrap ${
                            active
                              ? 'bg-[#164E24] text-white border-[#164E24] shadow-estate-1'
                              : 'bg-white text-[#1B241E] border-[#1B241E]/15 hover:border-[#164E24]'
                          }`}
                        >
                          {active && (
                            <Check className="w-4 h-4 text-[#A0F399]" aria-hidden="true" />
                          )}
                          <span>{addon.label}</span>
                          <span
                            className={`text-[12px] tabular-nums ${
                              active ? 'text-white/80' : 'text-[#71796F]'
                            }`}
                          >
                            +{formatCurrency(addon.basePrice)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Step 5: Property & Contact Form */}
              <section className="bg-white rounded-2xl p-6 sm:p-7 border-estate-hairline shadow-estate-1 space-y-5">
                <div>
                  <p className="text-[12px] font-bold text-[#2E7D32] tabular-nums">
                    05. Property Details
                  </p>
                  <h2 className="text-[20px] font-bold text-[#1B241E]">
                    Reserve Your On-Site Walkthrough
                  </h2>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div
                    role="alert"
                    className="rounded-xl bg-[#FFDAD6] text-[#93000A] px-4 py-3 text-[14px] font-semibold"
                  >
                    Please review the highlighted fields below to confirm your property
                    estimate.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="block text-[13px] font-semibold text-[#1B241E]"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={contact.fullName}
                      onChange={(e) => updateContact('fullName', e.target.value)}
                      placeholder="Margaret Vance"
                      aria-invalid={Boolean(errors.fullName)}
                      className={`estate-input w-full px-3.5 py-2.5 text-[15px] ${
                        errors.fullName ? 'estate-input-error' : ''
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[12px] font-semibold text-[#BA1A1A]">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="block text-[13px] font-semibold text-[#1B241E]"
                    >
                      Telephone *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      inputMode="tel"
                      value={contact.phone}
                      onChange={(e) =>
                        updateContact('phone', formatPhoneNumber(e.target.value))
                      }
                      placeholder="(256) 555-0194"
                      aria-invalid={Boolean(errors.phone)}
                      className={`estate-input w-full px-3.5 py-2.5 text-[15px] tabular-nums ${
                        errors.phone ? 'estate-input-error' : ''
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[12px] font-semibold text-[#BA1A1A]">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label
                      htmlFor="contact-address"
                      className="block text-[13px] font-semibold text-[#1B241E]"
                    >
                      Property Street Address *
                    </label>
                    <input
                      id="contact-address"
                      type="text"
                      value={contact.streetAddress}
                      onChange={(e) => updateContact('streetAddress', e.target.value)}
                      placeholder="412 Randolph Ave SE"
                      aria-invalid={Boolean(errors.streetAddress)}
                      className={`estate-input w-full px-3.5 py-2.5 text-[15px] ${
                        errors.streetAddress ? 'estate-input-error' : ''
                      }`}
                    />
                    {errors.streetAddress && (
                      <p className="text-[12px] font-semibold text-[#BA1A1A]">
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-neighborhood"
                      className="block text-[13px] font-semibold text-[#1B241E]"
                    >
                      Service Area *
                    </label>
                    <select
                      id="contact-neighborhood"
                      value={contact.neighborhood}
                      onChange={(e) => updateContact('neighborhood', e.target.value)}
                      aria-invalid={Boolean(errors.neighborhood)}
                      className={`estate-input w-full px-3.5 py-2.5 text-[15px] ${
                        errors.neighborhood ? 'estate-input-error' : ''
                      }`}
                    >
                      {NORTH_ALABAMA_AREAS.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="block text-[13px] font-semibold text-[#1B241E]"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                      placeholder="name@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className={`estate-input w-full px-3.5 py-2.5 text-[15px] ${
                        errors.email ? 'estate-input-error' : ''
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[12px] font-semibold text-[#BA1A1A]">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label
                      htmlFor="contact-date"
                      className="block text-[13px] font-semibold text-[#1B241E]"
                    >
                      Preferred Walkthrough Date *
                    </label>
                    <input
                      id="contact-date"
                      type="date"
                      value={contact.preferredDate}
                      onChange={(e) => updateContact('preferredDate', e.target.value)}
                      aria-invalid={Boolean(errors.preferredDate)}
                      className={`estate-input w-full sm:w-64 px-3.5 py-2.5 text-[15px] tabular-nums ${
                        errors.preferredDate ? 'estate-input-error' : ''
                      }`}
                    />
                    {errors.preferredDate && (
                      <p className="text-[12px] font-semibold text-[#BA1A1A]">
                        {errors.preferredDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Custom 20px x 20px rounded-square (4px) checkboxes */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {[
                    {
                      key: 'hasGateAccess' as const,
                      label: 'Locked side gate or access code',
                    },
                    {
                      key: 'hasPetsOnProperty' as const,
                      label: 'Pets regularly in yard',
                    },
                  ].map((box) => {
                    const checked = contact[box.key];
                    return (
                      <label
                        key={box.key}
                        className="inline-flex items-center gap-2.5 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => updateContact(box.key, e.target.checked)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`w-5 h-5 rounded-[4px] flex items-center justify-center border-2 shrink-0 ${
                            checked
                              ? 'bg-[#164E24] border-[#164E24] text-white'
                              : 'bg-white border-[#71796F]'
                          }`}
                        >
                          {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                        <span className="text-[14px] font-medium text-[#1B241E]">
                          {box.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-notes"
                    className="block text-[13px] font-semibold text-[#1B241E]"
                  >
                    Property Notes (Optional)
                  </label>
                  <textarea
                    id="contact-notes"
                    rows={3}
                    value={contact.notes}
                    onChange={(e) => updateContact('notes', e.target.value)}
                    placeholder="Shaded backyard Fescue, irrigation heads near driveway, preferred mowing day..."
                    className="estate-input w-full px-3.5 py-2.5 text-[15px]"
                  />
                </div>
              </section>
            </div>

            {/* Right Sticky Soft Earth Cream Estimate Summary Panel */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <div
                data-testid="quote-summary-panel"
                className="rounded-3xl bg-[#F4EBD9] p-6 sm:p-8 shadow-estate-2 space-y-6"
              >
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1B241E]/12">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#164E24]">
                      Live Property Estimate
                    </p>
                    <h2 className="text-[22px] font-bold text-[#1B241E] mt-0.5">
                      {SERVICE_TIERS[config.tier].name}
                    </h2>
                    <p className="text-[13px] text-[#414940] mt-0.5 tabular-nums">
                      {breakdown.acres.toFixed(2)} acres ·{' '}
                      {FREQUENCY_CONFIG[config.frequency].label}
                    </p>
                  </div>
                </div>

                {/* Itemized Lines */}
                <div className="space-y-3 text-[15px]">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#1B241E] font-medium">
                      Base Turf &amp; Grounds ({breakdown.acres.toFixed(2)} ac)
                    </span>
                    <span className="font-bold tabular-nums text-[#1B241E]">
                      {formatCurrency(breakdown.tierBaseAmount)}
                    </span>
                  </div>

                  {breakdown.addonLineItems.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between gap-4 text-[14px]"
                    >
                      <span className="text-[#414940]">+ {addon.label}</span>
                      <span className="font-semibold tabular-nums text-[#1B241E]">
                        {formatCurrency(addon.amount)}
                      </span>
                    </div>
                  ))}

                  {breakdown.discountAmount > 0 && (
                    <div className="flex items-center justify-between gap-4 text-[14px] text-[#2E7D32] font-semibold pt-2 border-t border-[#1B241E]/10">
                      <span>
                        {FREQUENCY_CONFIG[config.frequency].shortLabel} Plan Savings (
                        {Math.round(breakdown.discountRate * 100)}%)
                      </span>
                      <span className="tabular-nums">
                        -{formatCurrency(breakdown.discountAmount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Grand Totals */}
                <div className="rounded-2xl bg-white p-5 border-estate-hairline space-y-2">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[14px] font-semibold text-[#414940]">
                      Estimated Per Visit
                    </span>
                    <span
                      data-testid="quote-per-visit-total"
                      className="text-[32px] font-extrabold tracking-[-0.02em] tabular-nums text-[#164E24]"
                    >
                      {formatCurrency(breakdown.perVisitTotal)}
                    </span>
                  </div>

                  {breakdown.monthlyEstimate !== null ? (
                    <div className="flex items-center justify-between text-[13px] text-[#414940] pt-1 border-t border-[#1B241E]/8">
                      <span>Estimated Monthly Total</span>
                      <span className="font-bold tabular-nums text-[#1B241E]">
                        {formatCurrency(breakdown.monthlyEstimate)} / mo
                      </span>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#414940] pt-1 border-t border-[#1B241E]/8">
                      One-time estate restoration estimate · No ongoing commitment
                    </p>
                  )}

                  {breakdown.annualSavings > 0 && (
                    <p className="text-[12px] font-semibold text-[#2E7D32] tabular-nums">
                      Saves approx. {formatCurrency(breakdown.annualSavings)} across the
                      North Alabama growing season.
                    </p>
                  )}
                </div>

                {/* Primary Submit Action */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#164E24] hover:bg-[#003612] active:scale-[0.98] text-white text-[15px] font-semibold px-7 py-4 shadow-estate-1 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                    Confirm Estimate Request
                  </button>

                  <button
                    type="button"
                    onClick={onOpenCall}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#1B6D24] text-white text-[14px] font-semibold px-6 py-3 cursor-pointer"
                  >
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    Prefer to Call? (256) 555-0194
                  </button>
                </div>

                <div className="flex items-start gap-2.5 text-[12px] text-[#414940]">
                  <ShieldCheck
                    className="w-4 h-4 text-[#164E24] shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>
                    Zero payment required today. Final written quote verified during your
                    complimentary on-site walkthrough.
                  </span>
                </div>
              </div>
            </aside>
          </form>
        )
      ) : (
        /* SAVED ESTIMATES LIST */
        <section aria-label="Saved property estimates" className="space-y-4">
          {savedEstimates.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border-estate-hairline shadow-estate-1 space-y-4">
              <p className="text-[18px] font-bold text-[#1B241E]">
                No Saved Property Estimates Yet
              </p>
              <p className="text-[15px] text-[#414940] max-w-md mx-auto">
                Configure your lot size and preferred North Alabama turf care tier to save
                an instant estimate.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('configure')}
                className="inline-flex items-center rounded-full bg-[#164E24] text-white text-[14px] font-semibold px-6 py-3 cursor-pointer"
              >
                Start a New Quote
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {savedEstimates.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border-estate-hairline shadow-estate-1 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[12px] font-bold tabular-nums text-[#414940]">
                          {item.confirmationCode} ·{' '}
                          <span
                            className={
                              item.status === 'Scheduled'
                                ? 'text-[#2E7D32]'
                                : 'text-[#BA1A1A]'
                            }
                          >
                            {item.status}
                          </span>
                        </p>
                        <h3 className="text-[20px] font-bold text-[#1B241E] mt-1">
                          {item.contact.streetAddress}
                        </h3>
                        <p className="text-[13px] text-[#414940]">
                          {item.contact.fullName} · {item.contact.neighborhood}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-[24px] font-extrabold tabular-nums text-[#164E24]">
                          {formatCurrency(item.breakdown.perVisitTotal)}
                        </p>
                        <p className="text-[12px] text-[#71796F]">per visit</p>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#F9F8F6] p-4 border-estate-hairline space-y-1.5 text-[13px]">
                      <p className="font-semibold text-[#1B241E]">
                        {SERVICE_TIERS[item.config.tier].name} ·{' '}
                        {item.config.acres.toFixed(2)} ac ·{' '}
                        {FREQUENCY_CONFIG[item.config.frequency].label}
                      </p>
                      <p className="text-[#414940]">
                        Walkthrough requested: {item.contact.preferredDate} ·{' '}
                        {item.contact.phone}
                      </p>
                      {item.breakdown.addonLineItems.length > 0 && (
                        <p className="text-[#414940]">
                          Add-ons:{' '}
                          {item.breakdown.addonLineItems.map((a) => a.label).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1B241E]/8">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadEstimateIntoForm(item);
                        setAcresInput(item.config.acres.toFixed(2));
                        setSubmittedEstimate(null);
                        setActiveTab('configure');
                      }}
                      className="text-[14px] font-bold text-[#164E24] hover:text-[#003612] cursor-pointer"
                    >
                      Duplicate in Calculator
                    </button>

                    <div className="flex items-center gap-2">
                      {item.status === 'Scheduled' && (
                        <button
                          type="button"
                          onClick={() => onCancelEstimate(item.id)}
                          className="rounded-full border-[1.5px] border-[#164E24]/30 text-[#414940] hover:border-[#BA1A1A] hover:text-[#BA1A1A] text-[13px] font-semibold px-4 py-1.5 cursor-pointer"
                        >
                          Cancel Walkthrough
                        </button>
                      )}
                      <button
                        type="button"
                        aria-label={`Remove estimate ${item.confirmationCode}`}
                        onClick={() => onDeleteEstimate(item.id)}
                        className="w-9 h-9 rounded-full inline-flex items-center justify-center text-[#71796F] hover:bg-[#FFDAD6]/60 hover:text-[#BA1A1A] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
