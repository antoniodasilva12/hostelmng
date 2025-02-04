import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Bed, Users, CreditCard, Info } from 'lucide-react';

interface Room {
  id: string;
  room_number: string;
  floor_number: number;
  room_type: 'single' | 'double' | 'triple' | 'quad';
  capacity: number;
  price_per_semester: number;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  facilities: string[];
  description: string;
}

interface RoomBooking {
  id: string;
  room_id: string;
  student_id: string;
  check_in_date: string;
  check_out_date: string;
  semester: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  special_requests?: string;
}

export function RoomBooking() {
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState({
    semester: '',
    check_in_date: '',
    check_out_date: '',
    special_requests: ''
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      console.log('Fetching rooms...');

      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .in('status', ['available', 'reserved'])
        .order('room_number');

      if (error) {
        console.error('Error fetching rooms:', error);
        setError(`Failed to load rooms: ${error.message}`);
        return;
      }

      console.log('Fetched rooms:', data);
      setRooms(data || []);
      setError(null);
    } catch (error) {
      console.error('Error in fetchRooms:', error);
      setError('Failed to load rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      setError('You must be logged in to book a room');
      return;
    }
    
    if (!selectedRoom) {
      setError('Please select a room first');
      return;
    }

    if (!bookingData.semester || !bookingData.check_in_date || !bookingData.check_out_date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Check if user already has an active booking
      const { data: existingBooking, error: checkError } = await supabase
        .from('room_bookings')
        .select('*')
        .eq('student_id', user.id)
        .in('status', ['pending', 'approved'])
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingBooking) {
        setError('You already have an active booking');
        return;
      }

      // Create new booking
      const { error: bookingError } = await supabase
        .from('room_bookings')
        .insert({
          room_id: selectedRoom.id,
          student_id: user.id,
          check_in_date: bookingData.check_in_date,
          check_out_date: bookingData.check_out_date,
          semester: bookingData.semester,
          special_requests: bookingData.special_requests,
          total_amount: selectedRoom.price_per_semester,
          status: 'pending',
          payment_status: 'pending'
        });

      if (bookingError) throw bookingError;

      // Update room status
      const { error: updateError } = await supabase
        .from('rooms')
        .update({ status: 'reserved' })
        .eq('id', selectedRoom.id);

      if (updateError) throw updateError;

      alert('Booking request submitted successfully!');
      setSelectedRoom(null);
      setBookingData({
        semester: '',
        check_in_date: '',
        check_out_date: '',
        special_requests: ''
      });
      fetchRooms(); // Refresh the rooms list
    } catch (error) {
      console.error('Error in handleBooking:', error);
      setError('Failed to create booking. Please try again later.');
    }
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
      <h1 className="text-2xl font-bold mb-6">Room Booking</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Available Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {rooms.length === 0 ? (
          <div className="col-span-full text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No rooms available at the moment</p>
          </div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                selectedRoom?.id === room.id ? 'ring-2 ring-[#483285]' : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Room {room.room_number}</h3>
                  <p className="text-gray-600">Floor {room.floor_number} • {room.room_type}</p>
                </div>
                <Bed className="h-6 w-6 text-[#483285]" />
              </div>

              <p className="text-sm text-gray-600 mb-4">{room.description}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Capacity: {room.capacity}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                  <span>${room.price_per_semester}/semester</span>
                </div>
              </div>

              {room.facilities && room.facilities.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Facilities:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 rounded-full"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Booking Form */}
      {selectedRoom && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Book Room {selectedRoom.room_number}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Semester</label>
              <select
                value={bookingData.semester}
                onChange={(e) => setBookingData({ ...bookingData, semester: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#483285] focus:border-[#483285]"
                required
              >
                <option value="">Select Semester</option>
                <option value="Spring 2024">Spring 2024</option>
                <option value="Fall 2024">Fall 2024</option>
                <option value="Spring 2025">Spring 2025</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                <input
                  type="date"
                  value={bookingData.check_in_date}
                  onChange={(e) => setBookingData({ ...bookingData, check_in_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#483285] focus:border-[#483285]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                <input
                  type="date"
                  value={bookingData.check_out_date}
                  onChange={(e) => setBookingData({ ...bookingData, check_out_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#483285] focus:border-[#483285]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Special Requests</label>
              <textarea
                value={bookingData.special_requests}
                onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#483285] focus:border-[#483285]"
                placeholder="Any special requirements or preferences..."
              />
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <Info className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Your booking will be reviewed by the hostel administration.
                    You'll be notified once it's approved.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#483285] hover:bg-[#5a3fa6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#483285]"
            >
              <Bed className="mr-2 h-5 w-5" />
              Submit Booking Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 