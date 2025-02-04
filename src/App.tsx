import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { DashboardLayout } from './components/DashboardLayout';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { RoomBooking } from './components/RoomBooking';
import { RoomBookings } from './components/RoomBookings';
import { MealPlan } from './components/MealPlan';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

function ProtectedRoute({ children, allowedRoles = ['student', 'admin'] }: ProtectedRouteProps) {
  const { user, profile } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<div>Welcome to Dashboard</div>} />
          <Route
            path="rooms"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RoomBooking />
              </ProtectedRoute>
            }
          />
          <Route
            path="bookings"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RoomBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="meal-plan"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MealPlan />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;