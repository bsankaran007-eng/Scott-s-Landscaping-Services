import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateQuote,
  clampAcres,
  clampComparisonPercent,
  formatCurrency,
  formatPhoneNumber,
  generateConfirmationCode,
  validateContactForm,
  type QuoteContactForm,
} from './quoteEngine';

test('calculateQuote computes base essential tier accurately for 0.25 acres one-time', () => {
  const result = calculateQuote({
    acres: 0.25,
    tier: 'essential',
    frequency: 'onetime',
    addons: [],
  });

  assert.equal(result.tierBaseAmount, 68);
  assert.equal(result.addonsSubtotal, 0);
  assert.equal(result.discountAmount, 0);
  assert.equal(result.perVisitTotal, 68);
  assert.equal(result.monthlyEstimate, null);
  assert.equal(result.annualSavings, 0);
});

test('calculateQuote scales acreage and applies 12% weekly plan discount with add-ons', () => {
  const result = calculateQuote({
    acres: 0.75, // 0.50 extra acres = 2 extra quarter-acres
    tier: 'full_estate', // 112 + 2*36 = 184
    frequency: 'weekly', // 12% discount, 4 visits/mo
    addons: ['aeration', 'shrub_sculpting'],
  });

  // aeration scales: 85 * (1 + 0.5 * 0.45) = 85 * 1.225 = 104.125 -> 104
  // shrub_sculpting fixed: 75
  assert.equal(result.tierBaseAmount, 184);
  assert.equal(result.addonsSubtotal, 179);
  assert.equal(result.subtotalBeforeDiscount, 363);
  assert.equal(result.discountAmount, Math.round(363 * 0.12)); // 44
  assert.equal(result.perVisitTotal, 363 - 44); // 319
  assert.equal(result.monthlyEstimate, 319 * 4); // 1276
  assert.equal(result.annualSavings, 44 * 36);
});

test('calculateQuote deduplicates repeated add-on IDs and clamps extreme acreage', () => {
  assert.equal(clampAcres(0.01), 0.15);
  assert.equal(clampAcres(99), 3.5);
  assert.equal(clampAcres(Number.NaN), 0.5);

  const result = calculateQuote({
    acres: 0.5,
    tier: 'premier',
    frequency: 'biweekly',
    addons: ['edging', 'edging'],
  });
  assert.equal(result.addonLineItems.length, 1);
  assert.equal(result.discountRate, 0.06);
});

test('formatPhoneNumber formats North Alabama numbers progressively', () => {
  assert.equal(formatPhoneNumber(''), '');
  assert.equal(formatPhoneNumber('256'), '(256');
  assert.equal(formatPhoneNumber('256555'), '(256) 555');
  assert.equal(formatPhoneNumber('2565550194'), '(256) 555-0194');
  assert.equal(formatPhoneNumber('(256) 555-0194999'), '(256) 555-0194');
});

test('validateContactForm flags missing or malformed fields and passes valid forms', () => {
  const emptyForm: QuoteContactForm = {
    fullName: '',
    streetAddress: '',
    neighborhood: '',
    phone: '256-55',
    email: 'invalid-email',
    preferredDate: '',
    hasGateAccess: false,
    hasPetsOnProperty: false,
    notes: '',
  };

  const errors = validateContactForm(emptyForm);
  assert.ok(errors.fullName);
  assert.ok(errors.streetAddress);
  assert.ok(errors.neighborhood);
  assert.ok(errors.phone);
  assert.ok(errors.email);
  assert.ok(errors.preferredDate);

  const validForm: QuoteContactForm = {
    fullName: 'Margaret Vance',
    streetAddress: '412 Randolph Ave SE',
    neighborhood: 'Twickenham / Historic Huntsville',
    phone: '(256) 555-0148',
    email: 'margaret@vancehome.com',
    preferredDate: '2026-12-03',
    hasGateAccess: true,
    hasPetsOnProperty: false,
    notes: 'Side cedar gate code provided upon arrival.',
  };

  assert.deepEqual(validateContactForm(validForm), {});
});

test('utility helpers clamp comparison slider and format currency/confirmation codes', () => {
  assert.equal(clampComparisonPercent(-20), 5);
  assert.equal(clampComparisonPercent(150), 95);
  assert.equal(clampComparisonPercent(48.6), 49);
  assert.equal(formatCurrency(1276), '$1,276');
  assert.match(generateConfirmationCode(123456), /^EC-256-\d{4}$/);
});
