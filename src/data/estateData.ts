import { calculateQuote, type AddonId, type SavedEstimate, type ServiceTierId } from '../utils/quoteEngine';

export const ESTATE_IMAGES = {
  heroLawn: '/src/assets/images/hero_estate_lawn_1795606512936.jpg',
  beforeYard: '/src/assets/images/before_yard_overgrown_1795606511204.jpg',
  afterYard: '/src/assets/images/after_yard_manicured_1795606514031.jpg',
  pineStrawBeds: '/src/assets/images/service_pine_straw_beds_1795606513855.jpg',
  stoneCourtyard: '/src/assets/images/portfolio_stone_courtyard_1795606516163.jpg',
} as const;

export const NORTH_ALABAMA_AREAS = [
  'Huntsville — Jones Valley',
  'Huntsville — Monte Sano',
  'Twickenham / Historic Huntsville',
  'Hampton Cove',
  'Madison',
  'Owens Cross Roads',
  'Harvest & Monrovia',
] as const;

export type ServiceCategory = 'all' | 'turf' | 'seasonal' | 'health';

export interface EstateServiceItem {
  id: string;
  title: string;
  category: Exclude<ServiceCategory, 'all'>;
  categoryLabel: string;
  popular?: boolean;
  startingPrice: number;
  unitLabel: string;
  summary: string;
  deliverables: string[];
  linkedTier?: ServiceTierId;
  linkedAddon?: AddonId;
  image: string;
  imageAlt: string;
}

export const ESTATE_SERVICES: EstateServiceItem[] = [
  {
    id: 'full-turf-maintenance',
    title: 'Full Turf Maintenance',
    category: 'turf',
    categoryLabel: 'Turf & Mowing',
    popular: true,
    startingPrice: 112,
    unitLabel: 'per visit (0.25 ac)',
    summary:
      'Consistent weekly or bi-weekly mowing calibrated for North Alabama Zoysia, Bermuda, and Tall Fescue lawns with crisp striping and hand-finished edges.',
    deliverables: [
      'Blade height adjusted seasonally by turf cultivar',
      'Vertical steel-blade edging along all stone & concrete',
      'Garden bed weed pull & thorough driveway clearing',
    ],
    linkedTier: 'full_estate',
    image: ESTATE_IMAGES.heroLawn,
    imageAlt: 'Manicured striped Zoysia estate lawn in front of a classic Huntsville brick home',
  },
  {
    id: 'seasonal-pine-straw',
    title: 'Seasonal Pine Straw & Mulch',
    category: 'seasonal',
    categoryLabel: 'Seasonal Beds',
    popular: true,
    startingPrice: 140,
    unitLabel: 'per refresh',
    summary:
      'Clean, bright longleaf golden pine straw or double-shredded dark hardwood mulch installed with hand-tucked borders that hold through heavy spring rains.',
    deliverables: [
      'Deep Victorian trench edge recut before installation',
      'Premium needle-clean Southern longleaf bales',
      'Pre-emergent bed barrier applied prior to spreading',
    ],
    linkedAddon: 'pine_straw',
    image: ESTATE_IMAGES.pineStrawBeds,
    imageAlt: 'Freshly installed golden longleaf pine straw beside emerald grass and white hydrangeas',
  },
  {
    id: 'hedge-bed-sculpting',
    title: 'Precision Hedge & Bed Sculpting',
    category: 'seasonal',
    categoryLabel: 'Seasonal Beds',
    startingPrice: 75,
    unitLabel: 'per session',
    summary:
      'Architectural hand-shearing for boxwoods, loropetalum, holly, and hydrangeas to maintain clean sightlines without damaging next season’s bloom wood.',
    deliverables: [
      'Hand-pruning for specimen ornamentals & hydrangeas',
      'Clean geometric framing along porches and drives',
      'Complete green-waste removal from property',
    ],
    linkedAddon: 'shrub_sculpting',
    image: ESTATE_IMAGES.afterYard,
    imageAlt: 'Sculpted evergreen boxwoods bordering curved pine straw beds and brick residence',
  },
  {
    id: 'core-aeration-overseeding',
    title: 'Core Aeration & Overseeding',
    category: 'health',
    categoryLabel: 'Turf Health',
    startingPrice: 85,
    unitLabel: 'per treatment',
    summary:
      'Heavy-duty mechanical core aeration engineered specifically to relieve compacted Madison County red clay and drive root depth prior to summer heat.',
    deliverables: [
      'Double-pass 3-inch deep soil core extraction',
      'Certified shade-tolerant Fescue or warm-season overseeding',
      'Starter phosphorus & humic soil conditioner option',
    ],
    linkedAddon: 'aeration',
    image: ESTATE_IMAGES.heroLawn,
    imageAlt: 'Dense healthy green residential turf growing in aerated North Alabama soil',
  },
  {
    id: 'hardscape-courtyard-care',
    title: 'Limestone & Courtyard Stewardship',
    category: 'health',
    categoryLabel: 'Hardscape & Health',
    startingPrice: 175,
    unitLabel: 'per visit',
    summary:
      'Comprehensive grounds stewardship for estates with flagstone walkways, limestone terraces, outdoor kitchens, and layered perennial borders.',
    deliverables: [
      'Joint weed suppression along natural flagstone paths',
      'Dedicated crew lead with weekly photo walk-through',
      '7-step turf nutrition & seasonal color rotations',
    ],
    linkedTier: 'premier',
    image: ESTATE_IMAGES.stoneCourtyard,
    imageAlt: 'Natural sandstone and limestone residential walkway surrounded by manicured green turf',
  },
  {
    id: 'autumn-leaf-restoration',
    title: 'Canopy Leaf & Curb Restoration',
    category: 'seasonal',
    categoryLabel: 'Seasonal Beds',
    startingPrice: 95,
    unitLabel: 'per clearing',
    summary:
      'Thorough autumn and post-storm leaf extraction protecting turf crowns beneath mature Monte Sano oaks and maples.',
    deliverables: [
      'Multi-stage turf, shrub bed & gutter-line clearing',
      'Zero turf scalping or mower rutting on damp slopes',
      'Off-site organic composting haul-away included',
    ],
    linkedAddon: 'leaf_cleanup',
    image: ESTATE_IMAGES.pineStrawBeds,
    imageAlt: 'Clean autumn residential garden beds cleared of leaves with fresh golden pine straw',
  },
];

export interface SeasonSchedule {
  id: 'spring' | 'summer' | 'fall' | 'winter';
  label: string;
  months: string;
  focus: string;
  tasks: { title: string; detail: string }[];
}

export const SEASONAL_CALENDAR: SeasonSchedule[] = [
  {
    id: 'spring',
    label: 'Spring',
    months: 'March – May',
    focus: 'Pre-emergent crabgrass barrier, warm-season green-up & fresh pine straw.',
    tasks: [
      {
        title: 'Split Pre-Emergent Barrier',
        detail: 'Timed to Huntsville 55°F soil temperatures to lock out crabgrass and Poa annua.',
      },
      {
        title: 'Longleaf Pine Straw & Bed Recut',
        detail: 'Sharp 3-inch spade edging and bright golden pine straw across foundation beds.',
      },
      {
        title: 'Zoysia & Bermuda Scalp',
        detail: 'Controlled early spring thatch removal for uniform, velvet green-up.',
      },
    ],
  },
  {
    id: 'summer',
    label: 'Summer',
    months: 'June – August',
    focus: 'Weekly precision striping, drought-smart mowing heights & ornamental care.',
    tasks: [
      {
        title: 'Weekly Precision Striping',
        detail: 'Alternating stripe patterns prevent wheel ruts and keep dense turf upright.',
      },
      {
        title: 'Fescue Canopy Elevation',
        detail: 'Shaded lawns raised to 3.75–4 inches to shade roots through 95°F July afternoons.',
      },
      {
        title: 'Mid-Summer Fungus & Spot Check',
        detail: 'Proactive crew scouting for brown patch and dollar spot during humid spells.',
      },
    ],
  },
  {
    id: 'fall',
    label: 'Fall',
    months: 'September – November',
    focus: 'Core aeration, Fescue overseeding, winter weed block & canopy leaf removal.',
    tasks: [
      {
        title: 'Red Clay Core Aeration',
        detail: 'Breaks up summer soil compaction to restore oxygen and water percolation.',
      },
      {
        title: 'Canopy Oak Leaf Extraction',
        detail: 'Bi-weekly clearing prevents leaf mats from smothering winter turf crowns.',
      },
      {
        title: 'Autumn Pine Straw Refresh',
        detail: 'Insulates perennial root zones and restores crisp curb appeal before holidays.',
      },
    ],
  },
  {
    id: 'winter',
    label: 'Winter',
    months: 'December – February',
    focus: 'Dormant hardwood pruning, soil pH testing & limestone bed maintenance.',
    tasks: [
      {
        title: 'Dormant Structural Pruning',
        detail: 'Architectural shaping of crepe myrtles, hydrangeas, and deciduous shrubs.',
      },
      {
        title: 'Alabama Clay pH & Lime Calibration',
        detail: 'Lab soil sampling to balance acidity so spring fertilizer works at peak efficiency.',
      },
      {
        title: 'Winter Storm Limb & Bed Policing',
        detail: 'Monthly property checkups keeping driveways, patios, and beds immaculate.',
      },
    ],
  },
];

export interface PortfolioProject {
  id: string;
  title: string;
  neighborhood: string;
  category: 'turf' | 'beds' | 'hardscape';
  categoryLabel: string;
  acres: string;
  turnaround: string;
  summary: string;
  beforeNotes: string;
  afterNotes: string;
  metrics: { label: string; value: string }[];
  beforeImage: string;
  afterImage: string;
  defaultSliderPos: number;
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'monte-sano-estate',
    title: 'Monte Sano Ridge Residence',
    neighborhood: 'Monte Sano, Huntsville',
    category: 'turf',
    categoryLabel: 'Full Estate Turf',
    acres: '0.85 Acres',
    turnaround: '4-Day Restoration',
    summary:
      'Complete front lawn renovation, overgrown foundation shrub sculpting, deep bed trenching, and 68 bales of fresh longleaf pine straw.',
    beforeNotes: 'Compacted red clay, patchy broadleaf weeds, untrimmed shrubs obscuring masonry.',
    afterNotes: 'Dense striped emerald Zoysia, architectural boxwood geometry, razor-clean pine straw borders.',
    metrics: [
      { label: 'Lot Area', value: '0.85 ac' },
      { label: 'Pine Straw Installed', value: '68 bales' },
      { label: 'Completion Time', value: '4 days' },
    ],
    beforeImage: ESTATE_IMAGES.beforeYard,
    afterImage: ESTATE_IMAGES.afterYard,
    defaultSliderPos: 50,
  },
  {
    id: 'hampton-cove-manor',
    title: 'Hampton Cove Corner Estate',
    neighborhood: 'Hampton Cove, AL',
    category: 'beds',
    categoryLabel: 'Pine Straw & Beds',
    acres: '1.15 Acres',
    turnaround: '2-Day Refresh',
    summary:
      'Curved drive island redesign, steel-cut border definition, white limelight hydrangea pruning, and weekly striped turf management.',
    beforeNotes: 'Washed-out mulch edges, creeping Bermuda grass invading flower beds, uneven turf cut.',
    afterNotes: 'Deep 3-inch hand-tucked pine straw beds, crisp circular driveway striping, zero bed weeds.',
    metrics: [
      { label: 'Lot Area', value: '1.15 ac' },
      { label: 'Bed Edging Cut', value: '640 linear ft' },
      { label: 'Service Cadence', value: 'Weekly' },
    ],
    beforeImage: ESTATE_IMAGES.beforeYard,
    afterImage: ESTATE_IMAGES.heroLawn,
    defaultSliderPos: 46,
  },
  {
    id: 'twickenham-courtyard',
    title: 'Twickenham Limestone Terrace',
    neighborhood: 'Historic Twickenham, Huntsville',
    category: 'hardscape',
    categoryLabel: 'Stone & Hardscape',
    acres: '0.60 Acres',
    turnaround: '5-Day Stewardship',
    summary:
      'Integrated turf and flagstone courtyard restoration pairing manicured evergreen boxwood hedges with weed-free sandstone walkways.',
    beforeNotes: 'Overgrown perimeter beds crowding limestone paths and shaded thinning turf.',
    afterNotes: 'Sun-balanced emerald lawn framing restored sandstone walkways and layered shade perennials.',
    metrics: [
      { label: 'Lot Area', value: '0.60 ac' },
      { label: 'Stone Pathways', value: '1,180 sq ft' },
      { label: 'Turf Cultivar', value: 'Emerald Zoysia' },
    ],
    beforeImage: ESTATE_IMAGES.beforeYard,
    afterImage: ESTATE_IMAGES.stoneCourtyard,
    defaultSliderPos: 54,
  },
];

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  location: string;
  propertyNote: string;
  rating: number;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote:
      'Before Estate Craft took over our 0.9-acre lot on Monte Sano, two other crews left ruts and ignored our pine straw borders. Now our Zoysia looks like a private club every Friday afternoon, and the gate is always latched behind them.',
    author: 'Dr. Catherine & James Holloway',
    location: 'Monte Sano, Huntsville',
    propertyNote: '0.90 ac · Weekly Full Estate Plan',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'Their instant quote matched our on-site walkthrough to the dollar. In three days they recut every garden bed, installed 55 bales of golden pine straw, and brought our boxwoods back to crisp architectural lines.',
    author: 'Robert Langford',
    location: 'Hampton Cove, AL',
    propertyNote: '1.10 ac · Seasonal Restoration & Turf',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'Reliability is everything when you travel for work. We receive a clean completion notice after every visit, the flagstone patio is spotless, and neighbors regularly ask who maintains our front beds.',
    author: 'Elena & David Mercer',
    location: 'Jones Valley, Huntsville',
    propertyNote: '0.65 ac · Premier Architectural Grounds',
    rating: 5,
  },
];

export const SEEDED_ESTIMATES: SavedEstimate[] = [
  {
    id: 'seed-est-1',
    confirmationCode: 'EC-256-4820',
    createdAt: '2026-11-22T14:30:00.000Z',
    status: 'Scheduled',
    config: {
      acres: 0.75,
      tier: 'full_estate',
      frequency: 'weekly',
      addons: ['pine_straw', 'edging'],
    },
    breakdown: calculateQuote({
      acres: 0.75,
      tier: 'full_estate',
      frequency: 'weekly',
      addons: ['pine_straw', 'edging'],
    }),
    contact: {
      fullName: 'Harrison & Claire Bennett',
      streetAddress: '1804 Timberline Drive SE',
      neighborhood: 'Huntsville — Jones Valley',
      phone: '(256) 555-0182',
      email: 'claire.bennett@example.com',
      preferredDate: '2026-12-04',
      hasGateAccess: true,
      hasPetsOnProperty: false,
      notes: 'Focus on front circle drive pine straw beds and rear terrace edging.',
    },
  },
];
