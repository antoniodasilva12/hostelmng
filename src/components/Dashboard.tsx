import React from 'react';
import { PieChart, Users, PenTool as Tool, MessageSquare } from 'lucide-react';
import { useHostelStore } from '../store';

export function Dashboard() {
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
      icon: Tool,
    },
  ];

  const features = [
    {
      title: 'AI Room Allocation',
      description: 'Smart room assignment based on student preferences and availability',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      onClick: () => useHostelStore.getState().setActiveView('rooms'),
    },
    {
      title: 'Automated Check-in/out',
      description: 'Streamlined processes for efficient student management',
      image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?auto=format&fit=crop&w=800&q=80',
      onClick: () => useHostelStore.getState().setActiveView('students'),
    },
    {
      title: 'Smart Maintenance',
      description: 'Predictive maintenance and automated service requests',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      onClick: () => useHostelStore.getState().setActiveView('maintenance'),
    },
    {
      title: 'AI Chatbot Support',
      description: '24/7 automated assistance for student inquiries',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      onClick: () => useHostelStore.getState().setActiveView('chat'),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome to SmartHostel AI</h2>
        <p className="text-gray-600">Your AI-powered hostel management solution</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <button
            key={index}
            onClick={feature.onClick}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02] text-left"
          >
            <img 
              src={feature.image} 
              alt={feature.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}