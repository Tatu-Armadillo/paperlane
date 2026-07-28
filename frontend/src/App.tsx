import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from '@/layouts/RootLayout';

import HomePage from '@/pages/HomePage';
import PublishPage from '@/pages/PublishPage';
import DocumentDetailsPage from '@/pages/DocumentDetailsPage';
import CategoriesPage from '@/pages/CategoriesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Públicas */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/documents/:id" element={<DocumentDetailsPage />} />

        {/* Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;