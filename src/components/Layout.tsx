import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProfileStore } from "@/store/useProfileStore";
import { ListVideo, Users, Moon, Sun } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { savedProfiles } = useProfileStore();
  const location = useLocation();
  const isListView = location.pathname === "/list";

  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Sticky Header with Glassmorphism */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            aria-label="Go to homepage"
            className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-1"
          >
            <Users className="w-6 h-6 text-blue-600" />
            Influencer Search
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={isDark}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            >
              {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>

            <Link 
              to={isListView ? "/" : "/list"} 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            >
              <ListVideo className="w-4 h-4" />
              {isListView ? "Back to Search" : `My List (${savedProfiles.length})`}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {title && <h1 className="text-3xl font-extrabold mb-8 text-center">{title}</h1>}
        {children}
      </main>
    </div>
  );
}