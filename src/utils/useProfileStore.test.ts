import { describe, it, expect, beforeEach } from 'vitest';
import { useProfileStore } from '../store/useProfileStore';

describe('useProfileStore', () => {
  beforeEach(() => useProfileStore.setState({ savedProfiles: [] }));

  it('does not duplicate a profile already saved', () => {
    const profile = { username: 'cristiano' } as any;
    useProfileStore.getState().addProfile(profile);
    useProfileStore.getState().addProfile(profile);
    expect(useProfileStore.getState().savedProfiles.length).toBe(1);
  });

  it('removes a profile by username', () => {
    useProfileStore.getState().addProfile({ username: 'cristiano' } as any);
    useProfileStore.getState().removeProfile('cristiano');
    expect(useProfileStore.getState().savedProfiles.length).toBe(0);
  });
});