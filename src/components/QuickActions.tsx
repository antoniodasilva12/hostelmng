import { useNavigate } from 'react-router-dom';
import { Bed, Utensils, CreditCard } from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Book a Room',
      icon: Bed,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      onClick: () => navigate('/dashboard/rooms'),
    },
    {
      label: 'Order Meal',
      icon: Utensils,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/dashboard/meals'),
    },
    {
      label: 'Make Payment',
      icon: CreditCard,
      color: 'bg-yellow-600 hover:bg-yellow-700',
      onClick: () => navigate('/dashboard/payments'),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`w-full py-3 px-4 ${action.color} text-white rounded flex items-center justify-center gap-2 transition-colors`}
            >
              <Icon className="h-5 w-5" />
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
} 