import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function PrivateRoute({ children }) {
  const { isAuthenticated , user, loginAttempts } = useAuthStore();

  if (!isAuthenticated && !user) {
    if(loginAttempts ===0) {
      return <Navigate to="/landing_page" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
