import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserPlus, UserMinus } from "lucide-react";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useProfileStore } from "@/store/useProfileStore";
import { Avatar } from "./Avatar";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
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
    navigate(`/profile/${platform}/${profile.username}`);
  };

  const handleListAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeProfile(profile.username);
    } else {
      addProfile(profile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="group flex items-center gap-4 p-4 mb-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all w-full max-w-2xl"
      data-search={searchQuery}
    >
      <Avatar 
        src={profile.picture} 
        alt={profile.username} 
        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 shrink-0" 
      />
      
      <div className="flex-1 text-left">
        <div className="flex items-center text-lg font-bold text-gray-900 dark:text-gray-100">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {profile.fullname}
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-600 dark:text-gray-300">
          <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <span>{formatFollowersLocal(profile.followers)} followers</span>
        </div>
      </div>
      
      <button
        aria-label={isSaved ? `Remove ${profile.username} from list` : `Add ${profile.username} to list`}
        onClick={handleListAction}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
          isSaved 
            ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40" 
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        {isSaved ? (
          <>
            <UserMinus className="w-4 h-4" />
            <span>Remove</span>
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            <span>Add</span>
          </>
        )}
      </button>
    </motion.div>
  );
}