import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Home,
  Bed,
  Utensils,
  BookOpen,
  Calendar,
  Heart,
  MessageSquare,
  Settings,
  LogOut,
  MessageCircle
} from 'lucide-react';
import { RoomBookings } from './RoomBookings';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, signOut } = useAuthStore();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Bed, label: 'Room Booking', path: '/dashboard/rooms' },
    { icon: Utensils, label: 'Meal Plan', path: '/dashboard/meal-plan' },
    { icon: BookOpen, label: 'Facilities', path: '/dashboard/facilities' },
    { icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { icon: Heart, label: 'Health', path: '/dashboard/health' },
    { icon: MessageCircle, label: 'Feedback', path: '/dashboard/feedback' },
    { icon: MessageSquare, label: 'Chat Assistant', path: '/dashboard/chat' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    { icon: Bed, label: 'My Bookings', path: '/dashboard/bookings' }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#483285] text-white flex flex-col">
        {/* Logo and Title */}
        <div className="p-6">
          <h1 className="text-2xl font-bold">SmartHostel AI</h1>
          <p className="text-sm opacity-75 mt-1">
            {profile?.role === 'student' ? 'Student' : profile?.role === 'admin' ? 'Admin' : 'Guest'} Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-[#5a3fa6] transition-colors ${
                  isActive ? 'bg-[#5a3fa6]' : ''
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sign Out Button */}
        <div className="p-6">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center space-x-3 text-red-300 hover:text-red-200"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="h-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 