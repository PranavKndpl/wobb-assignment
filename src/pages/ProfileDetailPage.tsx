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
import { Avatar } from "@/components/Avatar";
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
    className="flex-grow w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] flex flex-col p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm"
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

  const { savedProfiles, addProfile, removeProfile } = useProfileStore();

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Data Unavailable</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Detailed analytics for <strong>@{username}</strong> are not included in the local mock data set. Try viewing Cristiano Ronaldo or MrBeast instead.
          </p>
          <Link to="/" className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isSaved = savedProfiles.some((p) => p.username === user.username);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-8 text-left">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800/50 rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100 dark:border-gray-800 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <Avatar
              src={user.picture}
              alt={user.username}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-4 ring-gray-50 dark:ring-gray-800 object-cover shrink-0"
            />
            
            <div className="flex-1 w-full">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  @{user.username}
                  <VerifiedBadge verified={user.is_verified} />
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold capitalize">
                  {platform}
                </div>
              </div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mb-4">
                {user.fullname}
              </p>

              {user.description && (
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto md:mx-0 mb-6">
                  {user.description}
                </p>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center md:justify-start">
                <button
                  onClick={() => isSaved ? removeProfile(user.username) : addProfile(user)}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all w-full sm:w-auto ${
                    isSaved 
                      ? "bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400" 
                      : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-lg"
                  }`}
                >
                  {isSaved ? <><UserMinus className="w-5 h-5" /> Remove from List</> : <><UserPlus className="w-5 h-5" /> Add to List</>}
                </button>

                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-all w-full sm:w-auto"
                  >
                    <ExternalLink className="w-5 h-5" /> View Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flexible Dashboard Metrics Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-4"
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