import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, ExternalLink, Users, Activity, 
  Heart, MessageCircle, Play, Image as ImageIcon,
  UserPlus, UserMinus
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useProfileStore } from "@/store/useProfileStore";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

const MetricCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <motion.div 
    whileHover={{ y: -2 }}
    className="flex flex-col p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm"
  >
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2 text-sm font-medium">
      <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        {icon}
      </div>
      {label}
    </div>
    <div className="text-2xl font-bold text-gray-900 dark:text-white">
      {value}
    </div>
  </motion.div>
);

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Zustand State
  const { savedProfiles, addProfile, removeProfile } = useProfileStore();

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">Invalid profile</p>
          <Link to="/" className="text-blue-600 hover:underline">Return Home</Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-20">
          <p className="text-red-500 mb-4 font-medium">Could not load profile details for {username}</p>
          <Link to="/" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isSaved = savedProfiles.some((p) => p.username === user.username);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800/50 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <img
              src={user.picture}
              alt={user.username}
              className="w-32 h-32 rounded-full ring-4 ring-gray-50 dark:ring-gray-800 object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                  @{user.username}
                </h2>
                <VerifiedBadge verified={user.is_verified} />
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-2">
                {user.fullname}
              </p>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold capitalize mb-4">
                {platform}
              </div>

              {user.description && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                  {user.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => isSaved ? removeProfile(user.username) : addProfile(user)}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  isSaved 
                    ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400" 
                    : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-lg"
                }`}
              >
                {isSaved ? <><UserMinus className="w-5 h-5" /> Remove</> : <><UserPlus className="w-5 h-5" /> Add to List</>}
              </button>

              {user.url && (
                <a
                  href={user.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all"
                >
                  <ExternalLink className="w-5 h-5" /> View Profile
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Dashboard Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <MetricCard 
            icon={<Users className="w-5 h-5 text-blue-500" />} 
            label="Followers" 
            value={formatFollowersDetail(user.followers)} 
          />
          
          <MetricCard 
            icon={<Activity className="w-5 h-5 text-purple-500" />} 
            label="Engagement Rate" 
            value={user.engagement_rate !== undefined ? formatEngagementRate(user.engagement_rate) : "N/A"} 
          />

          {user.engagements !== undefined && (
            <MetricCard 
              icon={<Heart className="w-5 h-5 text-rose-500" />} 
              label="Engagements" 
              value={formatFollowersDetail(user.engagements)} 
            />
          )}

          {user.avg_likes !== undefined && (
            <MetricCard 
              icon={<Heart className="w-5 h-5 text-red-500" />} 
              label="Avg Likes" 
              value={formatFollowersDetail(user.avg_likes)} 
            />
          )}

          {user.avg_comments !== undefined && (
            <MetricCard 
              icon={<MessageCircle className="w-5 h-5 text-green-500" />} 
              label="Avg Comments" 
              value={formatFollowersDetail(user.avg_comments)} 
            />
          )}

          {user.avg_views !== undefined && user.avg_views > 0 && (
            <MetricCard 
              icon={<Play className="w-5 h-5 text-orange-500" />} 
              label="Avg Views" 
              value={formatFollowersDetail(user.avg_views)} 
            />
          )}

          {user.posts_count !== undefined && (
            <MetricCard 
              icon={<ImageIcon className="w-5 h-5 text-indigo-500" />} 
              label="Total Posts" 
              value={user.posts_count} 
            />
          )}
        </motion.div>
      </div>
    </Layout>
  );
}