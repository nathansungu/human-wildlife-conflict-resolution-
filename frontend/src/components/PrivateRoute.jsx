import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export default function PrivateRoute({ children }) {
  const { isAuthenticated , user} = useAuthStore();

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
