import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useProfileStore } from "@/store/useProfileStore"; 

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K followers";
  return count + " followers";
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  
  const { savedProfiles, addProfile, removeProfile } = useProfileStore();
  
  const isSaved = savedProfiles.some((p) => p.username === profile.username);

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleListAction = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from firing
    if (isSaved) {
      removeProfile(profile.username);
    } else {
      addProfile(profile);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 border border-gray-300 mb-2 cursor-pointer hover:bg-gray-50 w-[700px]"
      data-search={searchQuery}
    >
      <img src={profile.picture} className="w-12 h-12 rounded-full" alt={profile.username} />
      <div className="text-left flex-1">
        <div className="font-bold">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600">{profile.fullname}</div>
        <div className="text-sm">{formatFollowersLocal(profile.followers)}</div>
      </div>
      
      <button
        onClick={handleListAction}
        className={`px-3 py-1 text-sm rounded cursor-pointer transition-colors ${
          isSaved 
            ? "bg-red-100 text-red-600 hover:bg-red-200" 
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {isSaved ? "Remove" : "Add to List"}
      </button>
    </div>
  );
}