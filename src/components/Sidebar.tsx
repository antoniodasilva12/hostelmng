import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Home,
  UserCircle,
  Building2,
  Wrench,
  Calendar,
  UtensilsCrossed,
  LogOut
} from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { path: 'dashboard', icon: Home, label: 'Dashboard' },
    { path: 'profile', icon: UserCircle, label: 'Profile' },
    { path: 'bookings', icon: Building2, label: 'Room Bookings' },
    { path: 'maintenance', icon: Wrench, label: 'Maintenance' },
    { path: 'meal-plan', icon: UtensilsCrossed, label: 'Meal Plan' },
  ];

  const isActive = (path: string) => location.pathname.endsWith(path);

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Profile Section - Always visible */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#483285] flex items-center justify-center">
            <span className="text-white text-lg font-semibold">
              {profile?.full_name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{profile?.full_name}</p>
            <p className="text-sm text-gray-500">{profile?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation - Scrollable if needed */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive(item.path)
                ? 'bg-[#483285] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button - Always visible at bottom */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-3 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
} 