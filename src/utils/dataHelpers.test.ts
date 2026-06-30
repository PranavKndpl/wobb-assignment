import { describe, it, expect } from 'vitest';
import { filterProfiles } from './dataHelpers';

describe('filterProfiles', () => {
  it('returns all profiles when query is empty', () => {
    const profiles = [{ username: 'a', fullname: 'A' }] as any;
    expect(filterProfiles(profiles, '')).toEqual(profiles);
  });

  it('returns empty array when nothing matches', () => {
    const profiles = [{ username: 'mrbeast', fullname: 'Mr Beast' }] as any;
    expect(filterProfiles(profiles, 'xyz')).toEqual([]);
  });
});