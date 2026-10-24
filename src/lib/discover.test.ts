import { describe, expect, it } from 'vitest';

import { ingredientLine, isoDuration, readableDuration } from './discover';

describe('ingredientLine', () => {
    it.each([
        [{ quantity: 400, unit: 'g', name: 'spaghetti' }, '400 g spaghetti'],
        [{ quantity: 0.5, unit: 'cup', name: 'olive oil' }, '½ cup olive oil'],
        [{ quantity: 2, unit: 'pcs', name: 'onions' }, '2 onions'],
        [{ quantity: 1 / 3, name: 'onion' }, '⅓ onion'],
        [{ quantity: 0.4, unit: 'kg', name: 'flour' }, '0.4 kg flour'],
        [{ quantity: 0, name: 'salt' }, 'salt'],
        [{ name: 'pepper' }, 'pepper'],
    ])('formats %o as %s', (ingredient, expected) => {
        expect(ingredientLine({ id: 'x', ...ingredient })).toBe(expected);
    });
});

describe('durations', () => {
    it.each([
        [5, 'PT5M', '5 min'],
        [60, 'PT1H', '1 hr'],
        [90, 'PT1H30M', '1 hr 30 min'],
        [0, 'PT0M', '0 min'],
    ])('%i minutes', (minutes, iso, readable) => {
        expect(isoDuration(minutes)).toBe(iso);
        expect(readableDuration(minutes)).toBe(readable);
    });
});
