import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Calendar, Clock, Users, Info } from 'lucide-react';

interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  description: string;
  operating_hours: {
    open: string;
    close: string;
  };
  is_available: boolean;
}

export function FacilityBooking() {
  const { user } = useAuthStore();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      setFacilities(data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      alert('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user || !selectedFacility) return;

    try {
      const startDateTime = new Date(`${bookingData.date}T${bookingData.startTime}`);
      const endDateTime = new Date(`${bookingData.date}T${bookingData.endTime}`);

      const { error } = await supabase
        .from('facility_bookings')
        .insert({
          user_id: user.id,
          facility_id: selectedFacility.id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          status: 'pending'
        });

      if (error) throw error;
      alert('Booking request submitted successfully!');
      setSelectedFacility(null);
      setBookingData({ date: '', startTime: '', endTime: '' });
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Book a Facility</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className={`bg-white rounded-lg shadow-md p-6 cursor-pointer ${
              selectedFacility?.id === facility.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            onClick={() => setSelectedFacility(facility)}
          >
            <h3 className="text-lg font-semibold mb-2">{facility.name}</h3>
            <p className="text-gray-600 mb-4">{facility.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>Capacity: {facility.capacity}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  Hours: {facility.operating_hours.open} - {facility.operating_hours.close}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedFacility && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Book {selectedFacility.name}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min={selectedFacility.operating_hours.open}
                  max={selectedFacility.operating_hours.close}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  min={bookingData.startTime}
                  max={selectedFacility.operating_hours.close}
                />
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!bookingData.date || !bookingData.startTime || !bookingData.endTime}
              className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Submit Booking Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 