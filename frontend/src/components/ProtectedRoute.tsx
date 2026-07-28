// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <>{children}</>;
// };


import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}