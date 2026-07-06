import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function RoleGuard({ allowed, children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowed && !allowed.includes(currentUser.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
