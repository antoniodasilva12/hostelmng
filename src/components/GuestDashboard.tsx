import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Bed, 
  UtensilsCrossed, 
  Calendar, 
  DollarSign,
  Info,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export function GuestDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    availableRooms: 0,
    mealPlans: [],
    upcomingEvents: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [roomsData, mealsData, eventsData] = await Promise.all([
        supabase.from('rooms').select('count').eq('status', 'available').single(),
        supabase.from('meal_plans').select('*').limit(3),
        supabase.from('events').select('*').gte('date', new Date().toISOString()).limit(3)
      ]);

      setStats({
        availableRooms: roomsData.data?.count || 0,
        mealPlans: mealsData.data || [],
        upcomingEvents: eventsData.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const quickActions = [
    {
      title: 'Book a Room',
      icon: Bed,
      description: 'Browse and book available rooms',
      path: '/dashboard/rooms',
      color: 'bg-blue-500'
    },
    {
      title: 'View Meal Plans',
      icon: UtensilsCrossed,
      description: 'Check our meal plan options',
      path: '/dashboard/meals',
      color: 'bg-green-500'
    },
    {
      title: 'Make Payment',
      icon: DollarSign,
      description: 'Process your payments securely',
      path: '/dashboard/payments',
      color: 'bg-purple-500'
    },
    {
      title: 'Chat Support',
      icon: Info,
      description: 'Get help from our AI assistant',
      path: '/dashboard/chat',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg shadow-lg p-6 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to SmartHostel</h1>
        <p className="opacity-90">Your comfort is our priority. Explore our services and amenities.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action) => (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`${action.color} text-white p-3 rounded-lg inline-block mb-4`}>
              <action.icon size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </button>
        ))}
      </div>

      {/* Stats and Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Available Rooms */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Bed className="mr-2 text-blue-500" />
            Available Rooms
          </h3>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {stats.availableRooms}
          </div>
          <button 
            onClick={() => navigate('/dashboard/rooms')}
            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
          >
            View Available Rooms →
          </button>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-5 w-5" />
              <span>123 Hostel Street, City, Country</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Phone className="mr-2 h-5 w-5" />
              <span>+1 234 567 8900</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Mail className="mr-2 h-5 w-5" />
              <span>contact@smarthostel.com</span>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 text-purple-500" />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {stats.upcomingEvents.map((event: any) => (
              <div key={event.id} className="border-b pb-3 last:border-0">
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Meal Plans */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <UtensilsCrossed className="mr-2 text-green-500" />
          Featured Meal Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.mealPlans.map((plan: any) => (
            <div key={plan.id} className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">{plan.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
              <p className="text-lg font-bold text-green-600">${plan.price}/month</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 