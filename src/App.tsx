import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchPage } from "@/pages/SearchPage";
import { ProfileDetailPage } from "@/pages/ProfileDetailPage";
import { MyListPage } from "@/pages/MyListPage";
import { ScrollToTop } from "@/components/ScrollToTop"; // Import it

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/profile/:username" element={<ProfileDetailPage />} />
        <Route path="/list" element={<MyListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;