import { describe, it, expect } from 'vitest';
import { formatEngagementRate } from './formatters';

describe('formatEngagementRate', () => {
  it('formats a typical rate as a percentage', () => {
    expect(formatEngagementRate(0.0423)).toBe('4.23%'); // adjust to actual output
  });

  it('handles zero', () => {
    expect(formatEngagementRate(0)).toBe('0%');
  });
});