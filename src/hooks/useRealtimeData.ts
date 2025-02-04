import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useHostelStore } from '../store';
import type { Notification, MaintenanceRequest } from '../types';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useRealtimeData() {
  const { setNotifications, setMaintenanceRequests, notifications, maintenanceRequests } = useHostelStore();

  useEffect(() => {
    const notificationsSubscription = supabase
      .channel('notifications')
      .on<RealtimePostgresChangesPayload<Notification>>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        (payload) => {
          // Update notifications in real-time
          setNotifications([...notifications, payload.new as Notification]);
        }
      )
      .subscribe();

    const maintenanceSubscription = supabase
      .channel('maintenance')
      .on<RealtimePostgresChangesPayload<MaintenanceRequest>>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'maintenance_requests' },
        (payload) => {
          setMaintenanceRequests([...maintenanceRequests, payload.new as MaintenanceRequest]);
        }
      )
      .subscribe();

    return () => {
      notificationsSubscription.unsubscribe();
      maintenanceSubscription.unsubscribe();
    };
  }, []);
} 