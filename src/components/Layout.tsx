import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useProfileStore } from "@/store/useProfileStore"; 

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { savedProfiles } = useProfileStore(); 

  return (
    <div className="p-4 min-h-screen">
      <header className="mb-6 border-b pb-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Influencer Search
          </Link>
          <Link to="/list" className="text-blue-600 hover:underline font-medium">
            My List ({savedProfiles.length})
          </Link>
        </div>
        {title && <h1 className="text-2xl mt-4">{title}</h1>}
      </header>
      <main>{children}</main>
    </div>
  );
}