import type { ProfileDetailResponse } from "@/types";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (!loader) {
    console.warn(`Profile loader: No file found for ${path}`);
    return null;
  }

  try {
    const result = await loader();
    const data = (result as unknown as { default: ProfileDetailResponse }).default || result;
    return data;
  } catch (error) {
    console.error("Failed to load profile:", error);
    return null;
  }
}