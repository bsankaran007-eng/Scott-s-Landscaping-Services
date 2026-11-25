import { useEffect, useState } from 'react';
import { ArrowRight, Check, MapPin, X } from 'lucide-react';
import { PORTFOLIO_PROJECTS, type PortfolioProject } from '../data/estateData';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { ResilientImage } from './ResilientImage';

interface PortfolioScreenProps {
  onStartQuoteForAcres: (acres: number) => void;
}

type PortfolioFilter = 'all' | 'turf' | 'beds' | 'hardscape';

const FILTER_TABS: { id: PortfolioFilter; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'turf', label: 'Full Estate Turf' },
  { id: 'beds', label: 'Pine Straw & Beds' },
  { id: 'hardscape', label: 'Stone & Hardscape' },
];

export function PortfolioScreen({ onStartQuoteForAcres }: PortfolioScreenProps) {
  const [filter, setFilter] = useState<PortfolioFilter>('all');
  const [featuredId, setFeaturedId] = useState<string>(PORTFOLIO_PROJECTS[0].id);
  const [inspectedProject, setInspectedProject] = useState<PortfolioProject | null>(null);

  const featuredProject =
    PORTFOLIO_PROJECTS.find((p) => p.id === featuredId) ?? PORTFOLIO_PROJECTS[0];

  const visibleProjects =
    filter === 'all'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === filter);

  useEffect(() => {
    if (!inspectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectedProject(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inspectedProject]);

  const parseAcres = (label: string): number => {
    const match = label.match(/[\d.]+/);
    return match ? Number.parseFloat(match[0]) : 0.75;
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 pt-8 sm:pt-12 space-y-16">
      {/* Header */}
      <section className="space-y-3 max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#8B5E2A]">
          North Alabama Portfolio
        </p>
        <h1 className="text-[32px] leading-[38px] sm:text-[42px] sm:leading-[50px] font-extrabold tracking-[-0.03em] text-[#1B241E]">
          Before &amp; After Estate Transformations
        </h1>
        <p className="text-[16px] leading-[24px] text-[#414940]">
          Inspect real Huntsville, Hampton Cove, and Twickenham restorations completed by
          our licensed local crews.
        </p>
      </section>

      {/* Interactive Comparison Studio */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border-estate-hairline shadow-estate-1 space-y-7">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-[#414940]">
              {featuredProject.neighborhood} · {featuredProject.acres} ·{' '}
              {featuredProject.turnaround}
            </p>
            <h2 className="text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-[#1B241E] mt-0.5">
              {featuredProject.title}
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Select property transformation"
            className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#F9F8F6] border-estate-hairline"
          >
            {PORTFOLIO_PROJECTS.map((proj) => {
              const active = proj.id === featuredProject.id;
              return (
                <button
                  key={proj.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setFeaturedId(proj.id)}
                  className={`px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#164E24] text-white shadow-estate-1'
                      : 'text-[#414940] hover:text-[#1B241E]'
                  }`}
                >
                  {proj.title.split(' ')[0]} {proj.title.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>

        <BeforeAfterSlider
          key={featuredProject.id}
          beforeSrc={featuredProject.beforeImage}
          afterSrc={featuredProject.afterImage}
          beforeAlt={`${featuredProject.title} before landscaping`}
          afterAlt={`${featuredProject.title} after Estate Craft landscaping`}
          projectTitle={featuredProject.title}
          initialPercent={featuredProject.defaultSliderPos}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {featuredProject.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl bg-[#F9F8F6] px-5 py-4 border-estate-hairline"
            >
              <p className="text-[12px] font-semibold text-[#71796F]">{metric.label}</p>
              <p className="text-[22px] font-extrabold tabular-nums text-[#164E24] mt-0.5">
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filterable Completed Projects Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-[26px] font-bold tracking-[-0.02em] text-[#1B241E]">
            Completed Residential Grounds
          </h2>

          <div
            role="tablist"
            aria-label="Filter completed portfolio projects"
            className="flex flex-wrap items-center gap-1.5"
          >
            {FILTER_TABS.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap cursor-pointer ${
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden border-estate-hairline shadow-estate-1 hover:shadow-estate-2 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] overflow-hidden bg-[#E6F1E7]">
                  <ResilientImage
                    src={project.afterImage}
                    alt={`${project.title} completed landscape`}
                    className="w-full h-full object-cover"
                    fallbackTitle={project.title}
                  />
                </div>
                <div className="p-6 space-y-3">
                  <p className="text-[12px] font-semibold text-[#414940]">
                    {project.categoryLabel} · {project.acres} · {project.turnaround}
                  </p>
                  <h3 className="text-[20px] font-bold text-[#1B241E]">{project.title}</h3>
                  <p className="flex items-center gap-1.5 text-[13px] font-medium text-[#164E24]">
                    <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    {project.neighborhood}
                  </p>
                  <p className="text-[14px] leading-[22px] text-[#414940]">
                    {project.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setInspectedProject(project)}
                  className="text-[14px] font-bold text-[#164E24] hover:text-[#003612] cursor-pointer whitespace-nowrap"
                >
                  Inspect Project Scope
                </button>
                <button
                  type="button"
                  onClick={() => onStartQuoteForAcres(parseAcres(project.acres))}
                  className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#164E24] text-[#164E24] hover:bg-[#ECF6EC] text-[13px] font-semibold px-4 py-2 cursor-pointer whitespace-nowrap"
                >
                  Quote Similar
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Project Inspection Modal */}
      {inspectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1B241E]/45 backdrop-blur-xs p-0 sm:p-4"
          onClick={() => setInspectedProject(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-estate-3 border-estate-hairline space-y-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[12px] font-semibold text-[#2E7D32]">
                  {inspectedProject.neighborhood} · {inspectedProject.acres} ·{' '}
                  {inspectedProject.turnaround}
                </p>
                <h2
                  id="project-modal-title"
                  className="text-[24px] font-bold tracking-[-0.01em] text-[#1B241E] mt-1"
                >
                  {inspectedProject.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close project details"
                onClick={() => setInspectedProject(null)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#414940] hover:bg-[#F9F8F6] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#E6F1E7]">
              <ResilientImage
                src={inspectedProject.afterImage}
                alt={`${inspectedProject.title} completed grounds`}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-[15px] leading-[24px] text-[#414940]">
              {inspectedProject.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#F9F8F6] p-4 border-estate-hairline">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#71796F] mb-1">
                  Before Arrival
                </p>
                <p className="text-[14px] text-[#1B241E]">{inspectedProject.beforeNotes}</p>
              </div>
              <div className="rounded-2xl bg-[#ECF6EC] p-4 border-estate-hairline">
                <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#164E24] mb-1">
                  Completed Craft
                </p>
                <p className="text-[14px] text-[#1B241E] flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{inspectedProject.afterNotes}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#1B241E]/8">
              <button
                type="button"
                onClick={() => setInspectedProject(null)}
                className="rounded-full border-[1.5px] border-[#164E24] text-[#164E24] hover:bg-[#ECF6EC] text-[14px] font-semibold px-5 py-2.5 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const acres = parseAcres(inspectedProject.acres);
                  setInspectedProject(null);
                  onStartQuoteForAcres(acres);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#164E24] hover:bg-[#003612] text-white text-[14px] font-semibold px-6 py-2.5 cursor-pointer"
              >
                Quote a {inspectedProject.acres} Property
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
