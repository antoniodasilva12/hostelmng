import { useState } from 'react';
import { useHostelStore } from '../store';
import { Calendar, User, Mail, Phone, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: 'single' | 'double' | 'triple';
}

export function BookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { rooms } = useHostelStore();
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    roomType: 'single'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check room availability
      const { data: availableRooms, error: roomError } = await supabase
        .from('rooms')
        .select('number')
        .eq('type', formData.roomType)
        .eq('status', 'available')
        .limit(1);

      if (roomError) throw roomError;
      if (!availableRooms?.length) {
        throw new Error(`No ${formData.roomType} rooms available for the selected dates`);
      }

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          guest_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          room_type: formData.roomType,
          check_in_date: formData.checkInDate,
          check_out_date: formData.checkOutDate,
          room_number: availableRooms[0].number,
          status: 'pending'
        });

      if (bookingError) throw bookingError;

      setSuccess(true);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        checkInDate: '',
        checkOutDate: '',
        roomType: 'single'
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Room</h2>

      {success ? (
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <h3 className="text-xl font-semibold text-green-600 mb-2">Booking Submitted Successfully!</h3>
          <p className="text-gray-600 mb-4">We'll review your booking and contact you shortly.</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Book Another Room
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
              <div className="mt-1 relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                  min={formData.checkInDate || new Date().toISOString().split('T')[0]}
                  className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Room Type</label>
            <div className="mt-1 relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value as BookingFormData['roomType'] })}
                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="single">Single Room ($300/month)</option>
                <option value="double">Double Room ($250/month)</option>
                <option value="triple">Triple Room ($200/month)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              'Submit Booking Request'
            )}
          </button>
        </form>
      )}
    </div>
  );
} 