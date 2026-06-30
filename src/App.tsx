import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";

const SearchPage = lazy(() => import("@/pages/SearchPage").then(m => ({ default: m.SearchPage })));
const ProfileDetailPage = lazy(() => import("@/pages/ProfileDetailPage").then(m => ({ default: m.ProfileDetailPage })));
const MyListPage = lazy(() => import("@/pages/MyListPage").then(m => ({ default: m.MyListPage })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> 
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          {/* Fixed Route Path: Added :platform */}
          <Route path="/profile/:platform/:username" element={<ProfileDetailPage />} />
          <Route path="/list" element={<MyListPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;