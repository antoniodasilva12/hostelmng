import { 
  PieChart, Users, Wrench, MessageSquare, Bell,
  Building2, UtensilsCrossed 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useHostelStore } from '../store';

export function DashboardHome() {
  const profile = useAuthStore((state) => state.profile);
  const { rooms, students, maintenanceRequests } = useHostelStore();

  const stats = [
    {
      title: 'Total Rooms',
      value: rooms.length,
      color: 'bg-blue-500',
      icon: PieChart,
    },
    {
      title: 'Total Students',
      value: students.length,
      color: 'bg-green-500',
      icon: Users,
    },
    {
      title: 'Maintenance Requests',
      value: maintenanceRequests.filter(r => r.status === 'pending').length,
      color: 'bg-orange-500',
      icon: Wrench,
    },
  ];

  const quickActions = [
    { title: 'Book a Room', icon: Building2, onClick: () => {} },
    { title: 'Report Issue', icon: Wrench, onClick: () => {} },
    { title: 'View Meal Plan', icon: UtensilsCrossed, onClick: () => {} },
  ];

  const notifications = [
    { title: 'Room Cleaning', message: 'Your room is scheduled for cleaning today', time: '2h ago' },
    { title: 'Maintenance Complete', message: 'AC repair has been completed', time: '5h ago' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {profile?.full_name}</h2>
        <p className="text-gray-600">Here's what's happening in your hostel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4 flex items-center justify-center`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{stat.title}</h3>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <action.icon className="h-5 w-5 text-[#483285]" />
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
        <div className="bg-white rounded-lg shadow-md divide-y">
          {notifications.map((notification, index) => (
            <div key={index} className="p-4">
              <div className="flex justify-between">
                <h4 className="font-medium">{notification.title}</h4>
                <span className="text-sm text-gray-500">{notification.time}</span>
              </div>
              <p className="text-gray-600 mt-1">{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 