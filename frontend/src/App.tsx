import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.tsx';
import HomePage from './pages/HomePage.tsx';
import PublishPage from './pages/PublishPage.tsx';
import DocumentDetailsPage from './pages/DocumentDetailsPage.tsx';
import CategoriesPage from './pages/CategoriesPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/publish" element={<PublishPage />} />
        <Route path="/documents/:id" element={<DocumentDetailsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
