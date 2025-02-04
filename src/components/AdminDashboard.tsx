import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Activity, Bell, CreditCard } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  activeBookings: number;
  pendingPayments: number;
  totalRevenue: number;
}

interface RevenueData {
  sum: { amount: number }[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeBookings: 0,
    pendingPayments: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [
        { count: studentsCount },
        { count: bookingsCount },
        { count: paymentsCount },
        { data: revenue }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }).eq('role', 'student'),
        supabase.from('bookings').select('*', { count: 'exact' }).eq('status', 'active'),
        supabase.from('payments').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('payments').select('sum(amount)').eq('status', 'completed').single()
      ]);

      setStats({
        totalStudents: studentsCount || 0,
        activeBookings: bookingsCount || 0,
        pendingPayments: paymentsCount || 0,
        totalRevenue: (revenue as RevenueData)?.sum.reduce((acc, curr) => acc + curr.amount, 0) || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Students</p>
              <h3 className="text-3xl font-bold">{stats.totalStudents}</h3>
            </div>
            <Users className="h-10 w-10 text-indigo-600" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Bookings</p>
              <h3 className="text-3xl font-bold">{stats.activeBookings}</h3>
            </div>
            <Activity className="h-10 w-10 text-green-600" />
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Pending Payments</p>
              <h3 className="text-3xl font-bold">{stats.pendingPayments}</h3>
            </div>
            <Bell className="h-10 w-10 text-yellow-600" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-3xl font-bold">${stats.totalRevenue}</h3>
            </div>
            <CreditCard className="h-10 w-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {/* Add recent activity list here */}
      </div>
    </div>
  );
} 