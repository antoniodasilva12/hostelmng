import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import {
  Bed,
  Utensils,
  Calendar,
  Activity,
  BookOpen,
  Users,
  MessageSquare,
  Bell,
  Shield,
  Heart,
  MessageCircle
} from 'lucide-react';

interface DashboardStats {
  roomStatus: string;
  mealPlanStatus: string;
  upcomingEvents: any[];
  facilityBookings: any[];
  notifications: any[];
  healthStatus: any;
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    roomStatus: '',
    mealPlanStatus: '',
    upcomingEvents: [],
    facilityBookings: [],
    notifications: [],
    healthStatus: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch room status
      const { data: roomData } = await supabase
        .from('bookings')
        .select('*, rooms(*)')
        .eq('user_id', user!.id)
        .single();

      // Fetch meal plan
      const { data: mealPlanData } = await supabase
        .from('student_meal_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      // Fetch upcoming events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(5);

      // Fetch facility bookings
      const { data: bookingsData } = await supabase
        .from('facility_bookings')
        .select('*, facilities(*)')
        .eq('user_id', user!.id)
        .order('start_time', { ascending: true })
        .limit(5);

      // Fetch health records
      const { data: healthData } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      setStats({
        roomStatus: roomData?.status || 'Not booked',
        mealPlanStatus: mealPlanData ? 'Active' : 'Not set',
        upcomingEvents: eventsData || [],
        facilityBookings: bookingsData || [],
        notifications: [],
        healthStatus: healthData
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Room Booking',
      icon: Bed,
      color: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700',
      path: '/dashboard/rooms'
    },
    {
      title: 'Meal Plan',
      icon: Utensils,
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700',
      path: '/dashboard/meal-plan'
    },
    {
      title: 'Facilities',
      icon: BookOpen,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      path: '/dashboard/facilities'
    },
    {
      title: 'Events',
      icon: Calendar,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      path: '/dashboard/events'
    },
    {
      title: 'Health',
      icon: Heart,
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700',
      path: '/dashboard/health'
    },
    {
      title: 'Feedback',
      icon: MessageCircle,
      color: 'bg-yellow-600',
      hoverColor: 'hover:bg-yellow-700',
      path: '/dashboard/feedback'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={`p-6 rounded-lg shadow-md ${action.color} ${action.hoverColor} text-white transition-colors`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-6 w-6" />
                <span className="text-lg font-medium">{action.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Room Status</p>
              <p className="text-lg font-semibold">{stats.roomStatus}</p>
            </div>
            <Bed className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Meal Plan</p>
              <p className="text-lg font-semibold">{stats.mealPlanStatus}</p>
            </div>
            <Utensils className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Events</p>
              <p className="text-lg font-semibold">{stats.upcomingEvents.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {stats.upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.start_time).toLocaleDateString()}
                  </p>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800">
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Facility Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
          <div className="space-y-4">
            {stats.facilityBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{booking.facilities.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.start_time).toLocaleString()}
                  </p>
                </div>
                <span className="px-2 py-1 text-sm rounded-full bg-green-100 text-green-800">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Health & Wellness</h2>
          <div className="space-y-4">
            {stats.healthStatus ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Blood Group</p>
                  <p className="font-medium">{stats.healthStatus.blood_group}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Last Checkup</p>
                  <p className="font-medium">
                    {new Date(stats.healthStatus.last_checkup_date).toLocaleDateString()}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-600">No health records available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 