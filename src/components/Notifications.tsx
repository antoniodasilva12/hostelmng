import { useHostelStore } from '../store';
import { Bell, Check } from 'lucide-react';

export function Notifications() {
  const { notifications, markNotificationAsRead } = useHostelStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>

      <div className="bg-white rounded-lg shadow-md">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications to display</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 flex items-start gap-4 ${
                  notification.read ? 'bg-white' : 'bg-blue-50'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  notification.type === 'error' ? 'bg-red-100' :
                  notification.type === 'success' ? 'bg-green-100' :
                  'bg-blue-100'
                }`}>
                  <Bell className={`h-5 w-5 ${
                    notification.type === 'warning' ? 'text-yellow-600' :
                    notification.type === 'error' ? 'text-red-600' :
                    notification.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600">{notification.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markNotificationAsRead(notification.id)}
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    <Check className="h-4 w-4" />
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 