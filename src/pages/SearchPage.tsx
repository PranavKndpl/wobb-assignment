import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { useProfileStore } from "@/store/useProfileStore";

export function SearchPage() {
  const {
    currentPlatform,
    setPlatform,
    searchQuery,
    setSearchQuery,
    searchScrollY,
    setSearchScrollY,
  } = useProfileStore();

  const allProfiles = extractProfiles(currentPlatform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  
   // Save scroll position 
  useEffect(() => {
    const handleScroll = () => {
      setSearchScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setSearchScrollY]);

  
   // Restore scroll 
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, searchScrollY);
      });
    });
  }, []);

  return (
    <Layout title="Find Influencers">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">
          Browse top creators across social platforms
        </p>
      </div>

      <PlatformFilter
        selected={currentPlatform}
        onChange={(platform) => {
          setPlatform(platform);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="mb-4">
        <p aria-live="polite" className="text-sm font-medium text-gray-400 dark:text-gray-500">
          Showing {filtered.length} of {allProfiles.length} on {currentPlatform}
        </p>
      </div>

      <ProfileList
        profiles={filtered}
        platform={currentPlatform}
        searchQuery={searchQuery}
        onProfileClick={() => {}}
      />
    </Layout>
  );
}