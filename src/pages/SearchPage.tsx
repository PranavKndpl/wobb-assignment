import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import type { Platform } from "@/types";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");

  const allProfiles = extractProfiles(platform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  const handleProfileClick = (username: string) => {
    console.log("Navigating to profile:", username);
  };

  return (
    <Layout title="Find Influencers">
      <div className="text-center mb-4">
        <p className="text-gray-500 text-sm">
          Browse top creators across social platforms
        </p>
      </div>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setPlatform(p);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Your wrapper fix to prevent margin collapse issues */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
          Showing {filtered.length} of {allProfiles.length} on {platform}
        </p>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}