import { useEffect, useState } from 'react';
import { CallModal } from './components/CallModal';
import { Footer } from './components/Footer';
import { MobileActionBar } from './components/MobileActionBar';
import { OverviewScreen } from './components/OverviewScreen';
import { PortfolioScreen } from './components/PortfolioScreen';
import { QuoteScreen } from './components/QuoteScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { TopBar, type ScreenId } from './components/TopBar';
import { SEEDED_ESTIMATES } from './data/estateData';
import type {
  AddonId,
  QuoteConfig,
  SavedEstimate,
  ServiceTierId,
} from './utils/quoteEngine';

const STORAGE_KEY = 'estate_craft_estimates_v1';

const DEFAULT_QUOTE_CONFIG: QuoteConfig = {
  acres: 0.5,
  tier: 'full_estate',
  frequency: 'weekly',
  addons: ['pine_straw'],
};

function loadSavedEstimates(): SavedEstimate[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEEDED_ESTIMATES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as SavedEstimate[];
    return SEEDED_ESTIMATES;
  } catch {
    return SEEDED_ESTIMATES;
  }
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('overview');
  const [quoteConfig, setQuoteConfig] = useState<QuoteConfig>(DEFAULT_QUOTE_CONFIG);
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>(loadSavedEstimates);
  const [callModalOpen, setCallModalOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(savedEstimates));
    } catch {
      // Ignore storage quota restrictions in private browsing
    }
  }, [savedEstimates]);

  const navigateTo = (screen: ScreenId) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  };

  const handleConfigureService = (options: { tier?: ServiceTierId; addon?: AddonId }) => {
    setQuoteConfig((prev) => {
      const nextTier = options.tier ?? prev.tier;
      const nextAddons =
        options.addon && !prev.addons.includes(options.addon)
          ? [...prev.addons, options.addon]
          : prev.addons;
      return { ...prev, tier: nextTier, addons: nextAddons };
    });
    navigateTo('quote');
  };

  const handleToggleServiceInQuote = (options: { tier?: ServiceTierId; addon?: AddonId }) => {
    setQuoteConfig((prev) => {
      if (options.tier) {
        return { ...prev, tier: options.tier };
      }
      if (options.addon) {
        const exists = prev.addons.includes(options.addon);
        return {
          ...prev,
          addons: exists
            ? prev.addons.filter((id) => id !== options.addon)
            : [...prev.addons, options.addon],
        };
      }
      return prev;
    });
  };

  const handleStartQuoteForAcres = (acres: number) => {
    setQuoteConfig((prev) => ({ ...prev, acres }));
    navigateTo('quote');
  };

  const handleSaveEstimate = (estimate: SavedEstimate) => {
    setSavedEstimates((prev) => [estimate, ...prev]);
  };

  const handleCancelEstimate = (id: string) => {
    setSavedEstimates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Cancelled' } : item))
    );
  };

  const handleDeleteEstimate = (id: string) => {
    setSavedEstimates((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLoadEstimateIntoForm = (estimate: SavedEstimate) => {
    setQuoteConfig({
      ...estimate.config,
      addons: [...estimate.config.addons],
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F6] text-[#1B241E]">
      <TopBar
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        savedCount={savedEstimates.filter((e) => e.status === 'Scheduled').length}
      />

      <main className="flex-1">
        {activeScreen === 'overview' && (
          <OverviewScreen
            onNavigate={navigateTo}
            onOpenCall={() => setCallModalOpen(true)}
            onConfigureService={handleConfigureService}
          />
        )}

        {activeScreen === 'services' && (
          <ServicesScreen
            quoteConfig={quoteConfig}
            onToggleServiceInQuote={handleToggleServiceInQuote}
            onSetFrequency={(frequency) =>
              setQuoteConfig((prev) => ({ ...prev, frequency }))
            }
            onProceedToQuote={() => navigateTo('quote')}
          />
        )}

        {activeScreen === 'portfolio' && (
          <PortfolioScreen onStartQuoteForAcres={handleStartQuoteForAcres} />
        )}

        {activeScreen === 'quote' && (
          <QuoteScreen
            config={quoteConfig}
            onChangeConfig={setQuoteConfig}
            savedEstimates={savedEstimates}
            onSaveEstimate={handleSaveEstimate}
            onCancelEstimate={handleCancelEstimate}
            onDeleteEstimate={handleDeleteEstimate}
            onLoadEstimateIntoForm={handleLoadEstimateIntoForm}
            onOpenCall={() => setCallModalOpen(true)}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} onOpenCall={() => setCallModalOpen(true)} />

      <MobileActionBar
        activeScreen={activeScreen}
        onOpenCall={() => setCallModalOpen(true)}
        onNavigateQuote={() => navigateTo('quote')}
      />

      <CallModal
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        onStartQuote={() => navigateTo('quote')}
      />
    </div>
  );
}
