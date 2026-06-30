import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProfileDetailPage } from '../pages/ProfileDetailPage';
import * as loader from '@/utils/profileLoader';

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('ProfileDetailPage', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('shows "Profile Data Unavailable" when no data is found', async () => {
    vi.spyOn(loader, 'loadProfileByUsername').mockResolvedValue(null as any);

    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={['/profile/instagram/unknown']}>
          <Routes>
            <Route path="/profile/:platform/:username" element={<ProfileDetailPage />} />
          </Routes>
        </MemoryRouter>
      );
      await flushPromises();
    });

    expect(container.textContent).toContain('Profile Data Unavailable');
  });
});