import { Layout } from "@/components/Layout";
import { useProfileStore } from "@/store/useProfileStore";
import { Link } from "react-router-dom";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export function MyListPage() {
  const { savedProfiles, removeProfile } = useProfileStore();

  return (
    <Layout title="My Saved Influencers">
      {savedProfiles.length === 0 ? (
        <p className="text-gray-500">Your list is currently empty.</p>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          {savedProfiles.map((profile) => (
            <div 
              key={profile.username} 
              className="flex items-center gap-4 p-4 border rounded shadow-sm"
            >
              <img src={profile.picture} alt={profile.username} className="w-12 h-12 rounded-full" />
              <div className="flex-1 text-left">
                <Link to={`/profile/${profile.username}`} className="font-bold text-blue-600 hover:underline">
                  @{profile.username}
                  <VerifiedBadge verified={profile.is_verified} />
                </Link>
                <div className="text-sm text-gray-600">{profile.fullname}</div>
              </div>
              <button
                onClick={() => removeProfile(profile.username)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}