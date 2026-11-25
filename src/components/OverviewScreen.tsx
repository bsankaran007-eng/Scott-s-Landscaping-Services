import { useState } from 'react';
import {
  ArrowRight,
  Check,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
} from 'lucide-react';
import {
  ESTATE_IMAGES,
  ESTATE_SERVICES,
  PORTFOLIO_PROJECTS,
  TESTIMONIALS,
} from '../data/estateData';
import type { AddonId, ServiceTierId } from '../utils/quoteEngine';
import { formatCurrency } from '../utils/quoteEngine';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ResilientImage } from './ResilientImage';
import type { ScreenId } from './TopBar';

interface OverviewScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenCall: () => void;
  onConfigureService: (options: { tier?: ServiceTierId; addon?: AddonId }) => void;
}

export function OverviewScreen({
  onNavigate,
  onOpenCall,
  onConfigureService,
}: OverviewScreenProps) {
  const [activeProjectId, setActiveProjectId] = useState(PORTFOLIO_PROJECTS[0].id);
  const activeProject =
    PORTFOLIO_PROJECTS.find((p) => p.id === activeProjectId) ?? PORTFOLIO_PROJECTS[0];

  const featuredServices = ESTATE_SERVICES.slice(0, 4);

  return (
    <div className="space-y-20 sm:space-y-24">
      {/* HERO SECTION */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2 sm:py-4">
            <div className="space-y-6">
              {/* Contact Badges & Trust Seals (per Estate Craft spec) */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D4A373] px-3.5 py-1.5 shadow-estate-1">
                  <div className="flex items-center gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-3.5 h-3.5 fill-[#D4A373] text-[#D4A373]"
                      />
                    ))}
                  </div>
                  <span className="text-[14px] font-extrabold tabular-nums text-[#1B241E]">
                    5.0
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#414940]">
                    Huntsville&apos;s Choice
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F4EBD9] px-3.5 py-1.5 text-[#164E24]">
                  <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.06em]">
                    Huntsville &amp; Madison County
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-[32px] leading-[38px] sm:text-[42px] sm:leading-[50px] lg:text-[48px] lg:leading-[56px] font-extrabold tracking-[-0.03em] text-[#1B241E]">
                  Estate-Grade Lawn Care for North Alabama Homes
                </h1>
                <p className="text-[16px] sm:text-[18px] leading-[26px] sm:leading-[28px] tracking-[-0.01em] text-[#414940] max-w-xl">
                  Meticulous turf striping, hand-tucked golden longleaf pine straw, and
                  licensed horticultural care—engineered for Zoysia, Bermuda, and shaded
                  Fescue estates across Madison County.
                </p>
              </div>

              {/* Primary + Direct Phone CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('quote')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#164E24] hover:bg-[#003612] active:scale-[0.98] text-white text-[15px] font-semibold tracking-[0.01em] px-7 py-3.5 shadow-estate-1 cursor-pointer whitespace-nowrap"
                >
                  Get Instant Quote
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onOpenCall}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2E7D32] hover:bg-[#1B6D24] active:scale-[0.98] text-white text-[15px] font-semibold tracking-[0.01em] px-6 py-3.5 shadow-estate-1 cursor-pointer whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  <span className="tabular-nums">(256) 555-0194</span>
                </button>
              </div>
            </div>

            {/* Quiet assurance line */}
            <div className="pt-7 mt-7 border-t border-[#1B241E]/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-[#414940]">
              <span className="uppercase tracking-[0.06em] text-[11px] font-bold text-[#164E24]">
                Licensed &amp; Insured
              </span>
              <span aria-hidden="true" className="text-[#1B241E]/25">
                ·
              </span>
              <span>Transparent Acreage Pricing</span>
              <span aria-hidden="true" className="hidden sm:inline text-[#1B241E]/25">
                ·
              </span>
              <span className="w-full sm:w-auto">Same-Week Property Walks</span>
            </div>
          </div>

          {/* Right Hero Media Column (stretched cleanly to match text height) */}
          <div className="lg:col-span-6">
            <div className="relative h-[320px] sm:h-[420px] lg:h-full lg:min-h-[460px] rounded-3xl overflow-hidden shadow-estate-2 border-estate-hairline bg-[#E6F1E7]">
              <ResilientImage
                src={ESTATE_IMAGES.heroLawn}
                alt="Manicured striped emerald Zoysia estate lawn with fresh golden pine straw beds in Huntsville, Alabama"
                className="w-full h-full object-cover"
                fallbackTitle="North Alabama Estate Turf Care"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1B241E]/85 via-[#1B241E]/40 to-transparent p-6 sm:p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#D4A373] mb-1">
                  Featured Grounds · Monte Sano
                </p>
                <p className="text-[16px] sm:text-[18px] font-bold text-white leading-snug">
                  1.15-Acre Emerald Zoysia Turf &amp; Longleaf Pine Straw Stewardship
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof & Metrics Strip */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              metric: '5.0 / 5.0',
              label: 'Google Rating',
              detail: '218 verified Huntsville reviews',
            },
            {
              metric: '14+ Years',
              label: 'North Alabama Craft',
              detail: 'Dedicated Madison County crews',
            },
            {
              metric: '48 Hours',
              label: 'Walkthrough Turnaround',
              detail: 'Written acreage-accurate quotes',
            },
            {
              metric: '100%',
              label: 'Curbside Guarantee',
              detail: 'Complimentary re-service if missed',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border-estate-hairline shadow-estate-1"
            >
              <p className="text-[24px] sm:text-[28px] font-extrabold tracking-[-0.02em] tabular-nums text-[#164E24]">
                {stat.metric}
              </p>
              <p className="text-[14px] font-bold text-[#1B241E] mt-1">{stat.label}</p>
              <p className="text-[13px] text-[#414940] mt-0.5">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED SERVICES SECTION */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2E7D32]">
              Tailored Horticultural Programs
            </p>
            <h2 className="text-[26px] leading-[32px] sm:text-[36px] sm:leading-[44px] font-bold tracking-[-0.02em] text-[#1B241E]">
              Built for North Alabama Turf &amp; Red Clay
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-[#164E24] text-[#164E24] hover:bg-[#ECF6EC] text-[14px] font-semibold px-5 py-2.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            View All Services &amp; Calendar
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredServices.map((service) => (
            <article
              key={service.id}
              className={`bg-white rounded-2xl overflow-hidden border-estate-hairline shadow-estate-1 hover:shadow-estate-2 flex flex-col justify-between ${
                service.popular ? 'border-t-[3px] border-t-[#2E7D32]' : ''
              }`}
            >
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold text-[#414940]">
                      {service.categoryLabel}
                      {service.popular ? ' · Most Requested' : ''}
                    </p>
                    <h3 className="text-[22px] font-bold tracking-[-0.01em] text-[#1B241E] mt-1">
                      {service.title}
                    </h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[22px] font-extrabold tabular-nums text-[#164E24]">
                      {formatCurrency(service.startingPrice)}
                    </p>
                    <p className="text-[12px] text-[#71796F]">{service.unitLabel}</p>
                  </div>
                </div>

                <p className="text-[15px] leading-[24px] text-[#414940]">{service.summary}</p>

                <ul className="space-y-2 pt-1">
                  {service.deliverables.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[14px] text-[#1B241E]"
                    >
                      <Check
                        className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 sm:px-7 py-4 bg-[#F9F8F6]/70 border-t border-[#1B241E]/6 flex items-center justify-between gap-4">
                <span className="text-[13px] font-medium text-[#414940]">
                  Includes licensed crew lead walkthrough
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onConfigureService({
                      tier: service.linkedTier,
                      addon: service.linkedAddon,
                    })
                  }
                  className="text-[14px] font-bold text-[#164E24] hover:text-[#003612] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  Configure Quote
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* INTERACTIVE BEFORE / AFTER SHOWCASE */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-estate-hairline shadow-estate-1">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="space-y-2 max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8B5E2A]">
                Verified Property Transformations
              </p>
              <h2 className="text-[26px] leading-[32px] sm:text-[36px] sm:leading-[44px] font-bold tracking-[-0.02em] text-[#1B241E]">
                See the Estate Craft Standard Side by Side
              </h2>
              <p className="text-[15px] text-[#414940]">
                Slide across real Madison County restorations to inspect bed definition,
                turf density, and architectural shrub lines.
              </p>
            </div>

            {/* Project switcher */}
            <div
              role="tablist"
              aria-label="Featured before and after properties"
              className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#F9F8F6] border-estate-hairline"
            >
              {PORTFOLIO_PROJECTS.map((project) => {
                const selected = project.id === activeProject.id;
                return (
                  <button
                    key={project.id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => setActiveProjectId(project.id)}
                    className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer ${
                      selected
                        ? 'bg-[#164E24] text-white shadow-estate-1'
                        : 'text-[#414940] hover:text-[#1B241E]'
                    }`}
                  >
                    {project.title.split(' ')[0]} {project.title.split(' ')[1]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <BeforeAfterSlider
                key={activeProject.id}
                beforeSrc={activeProject.beforeImage}
                afterSrc={activeProject.afterImage}
                beforeAlt={`${activeProject.title} lawn before Estate Craft restoration`}
                afterAlt={`${activeProject.title} manicured estate lawn after Estate Craft service`}
                projectTitle={activeProject.title}
                initialPercent={activeProject.defaultSliderPos}
              />
            </div>

            <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div>
                  <p className="text-[13px] font-semibold text-[#414940]">
                    {activeProject.neighborhood} · {activeProject.acres} ·{' '}
                    {activeProject.turnaround}
                  </p>
                  <h3 className="text-[22px] font-bold tracking-[-0.01em] text-[#1B241E] mt-1">
                    {activeProject.title}
                  </h3>
                </div>

                <p className="text-[15px] leading-[24px] text-[#414940]">
                  {activeProject.summary}
                </p>

                <div className="rounded-2xl bg-[#F9F8F6] p-4 space-y-3 border-estate-hairline">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#71796F]">
                      Initial Condition
                    </p>
                    <p className="text-[14px] text-[#1B241E] mt-0.5">
                      {activeProject.beforeNotes}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1B241E]/8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2E7D32]">
                      Estate Craft Outcome
                    </p>
                    <p className="text-[14px] text-[#1B241E] mt-0.5">
                      {activeProject.afterNotes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => onNavigate('quote')}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#164E24] hover:bg-[#003612] active:scale-[0.98] text-white text-[15px] font-semibold px-6 py-3 cursor-pointer"
                >
                  Estimate a Similar Restoration
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('portfolio')}
                  className="w-full inline-flex items-center justify-center rounded-full border-[1.5px] border-[#164E24] text-[#164E24] hover:bg-[#ECF6EC] text-[14px] font-semibold px-6 py-2.5 cursor-pointer"
                >
                  Open Full Portfolio Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOFT EARTH CREAM TESTIMONIALS & GUARANTEE SECTION */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="rounded-3xl bg-[#F4EBD9] p-6 sm:p-10 lg:p-12 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#164E24]">
                Homeowner Reputation
              </p>
              <h2 className="text-[26px] leading-[32px] sm:text-[36px] sm:leading-[44px] font-bold tracking-[-0.02em] text-[#1B241E]">
                Trusted Across Huntsville, Madison &amp; Hampton Cove
              </h2>
            </div>

            <div className="inline-flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-[#D4A373]/70 shadow-estate-1 self-start lg:self-auto">
              <ShieldCheck className="w-6 h-6 text-[#2E7D32] shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[14px] font-bold text-[#1B241E]">
                  100% Curbside Satisfaction Guarantee
                </p>
                <p className="text-[12px] text-[#414940]">
                  Any missed detail corrected within 24 hours at zero charge.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.id}
                className="bg-white rounded-2xl p-6 border-estate-hairline shadow-estate-1 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-[#D4A373] text-[#D4A373]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <blockquote className="text-[15px] leading-[24px] text-[#1B241E]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                </div>

                <figcaption className="pt-4 border-t border-[#1B241E]/8">
                  <p className="text-[15px] font-bold text-[#1B241E]">{item.author}</p>
                  <p className="text-[13px] text-[#414940]">
                    {item.location} · {item.propertyNote}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#1B241E]/10">
            <p className="text-[16px] font-semibold text-[#1B241E]">
              Ready for a written, acreage-accurate quote for your property?
            </p>
            <button
              type="button"
              onClick={() => onNavigate('quote')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#164E24] hover:bg-[#003612] active:scale-[0.98] text-white text-[15px] font-semibold px-7 py-3.5 shadow-estate-1 cursor-pointer whitespace-nowrap"
            >
              Calculate My Property Quote
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
