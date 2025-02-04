import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location: string;
  max_participants: number;
}

interface EventRegistration {
  id: string;
  event_id: string;
  status: 'registered' | 'waitlisted' | 'cancelled';
}

export function EventsManagement() {
  const { user } = useAuthStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, EventRegistration>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchRegistrations();
    }
  }, [user]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('end_time', new Date().toISOString())
        .order('start_time');

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events');
    }
  };

  const fetchRegistrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('event_registrations')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      const registrationsMap = (data || []).reduce((acc, reg) => ({
        ...acc,
        [reg.event_id]: reg
      }), {});
      
      setRegistrations(registrationsMap);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          user_id: user.id,
          event_id: eventId,
          status: 'registered'
        });

      if (error) throw error;
      fetchRegistrations();
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Failed to register for event');
    }
  };

  const handleCancellation = async (eventId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('event_id', eventId);

      if (error) throw error;
      fetchRegistrations();
      alert('Registration cancelled successfully');
    } catch (error) {
      console.error('Error cancelling registration:', error);
      alert('Failed to cancel registration');
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
      <h1 className="text-2xl font-bold mb-6">Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => {
          const registration = registrations[event.id];
          const isRegistered = registration?.status === 'registered';
          
          return (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    {new Date(event.start_time).toLocaleString()} - 
                    {new Date(event.end_time).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Max Participants: {event.max_participants}</span>
                </div>
              </div>

              {isRegistered ? (
                <button
                  onClick={() => handleCancellation(event.id)}
                  className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                >
                  Cancel Registration
                </button>
              ) : (
                <button
                  onClick={() => handleRegistration(event.id)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Register
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 