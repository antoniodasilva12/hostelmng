import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Bed, Calendar, Clock, CreditCard, AlertCircle } from 'lucide-react';

interface RoomBooking {
  id: string;
  room: {
    room_number: string;
    floor_number: number;
    room_type: string;
    price_per_semester: number;
  };
  check_in_date: string;
  check_out_date: string;
  semester: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  special_requests?: string;
  created_at: string;
}

export function RoomBookings() {
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<RoomBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('room_bookings')
        .select(`
          *,
          room:rooms (
            room_number,
            floor_number,
            room_type,
            price_per_semester
          )
        `)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#483285]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Room Bookings</h2>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Bed className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't made any room bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Room {booking.room.room_number}
                  </h3>
                  <p className="text-gray-600">
                    Floor {booking.room.floor_number} • {booking.room.room_type}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Check-in: {formatDate(booking.check_in_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Check-out: {formatDate(booking.check_out_date)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Semester: {booking.semester}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>
                      Payment: {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {booking.special_requests && (
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Special Requests:</p>
                  <p className="mt-1">{booking.special_requests}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-lg font-semibold">${booking.total_amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 