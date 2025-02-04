import React from 'react';
import { PieChart, Users, Wrench, MessageSquare } from 'lucide-react';
import { useHostelStore } from '../store';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

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
      icon: Wrench,
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
    <div className="h-screen flex">
      {/* Fixed Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white">
        <Sidebar />
      </div>

      {/* Main Content with left margin to account for fixed sidebar */}
      <div className="flex-1 ml-64 overflow-auto bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}