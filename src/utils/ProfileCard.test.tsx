import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRoot, type Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import { ProfileCard } from '../components/ProfileCard';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('ProfileCard', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mockNavigate.mockClear();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('navigates with platform and username as path params', () => {
    const profile = { username: 'cristiano', fullname: 'Cristiano Ronaldo', followers: 1000, user_id: '1' } as any;

    act(() => {
      root.render(
        <MemoryRouter>
          <ProfileCard profile={profile} platform="instagram" searchQuery="" />
        </MemoryRouter>
      );
    });

    const card = container.querySelector('.group') as HTMLElement;
    act(() => card.click());

    expect(mockNavigate).toHaveBeenCalledWith('/profile/instagram/cristiano');
  });
});