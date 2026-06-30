import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, UserMinus, Users, Inbox } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useProfileStore } from "@/store/useProfileStore";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Avatar } from "../components/Avatar";

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return count.toString();
}

export function MyListPage() {
  const { savedProfiles, removeProfile } = useProfileStore();

  // Framer Motion variants for staggering the list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout title="My Saved Influencers">
      <div className="max-w-4xl mx-auto w-full">
        {savedProfiles.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm"
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
              <Inbox className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your list is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">
              You haven't added any influencers to your list yet. Head back to the search page to discover creators.
            </p>
            <Link
              to="/"
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Search
            </Link>
          </motion.div>
        ) : (
          /* Staggered Grid of Saved Profiles */
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {savedProfiles.map((profile) => (
              <motion.div
                key={profile.username}
                variants={item}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all group"
              >
                <Avatar 
                  src={profile.picture} 
                  alt={profile.username} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700 shrink-0" 
                />
                <div className="flex-1 text-center sm:text-left w-full">
                  <Link
                    to={`/profile/${profile.platform}/${profile.username}`}
                    className="flex items-center justify-center sm:justify-start gap-1 text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    @{profile.username}
                    <VerifiedBadge verified={profile.is_verified} />
                  </Link>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    {profile.fullname}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-700/50 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    <Users className="w-3 h-3" />
                    {formatFollowersLocal(profile.followers)}
                  </div>
                </div>
                <button
                  onClick={() => removeProfile(profile.username)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 mt-2 sm:mt-0 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                  Remove
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}