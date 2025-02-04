import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

export const db = {
  profiles: {
    async getProfile(userId: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error) throw error;
      return data;
    },
    async updateProfile(userId: string, updates: Database['public']['Tables']['profiles']['Update']) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },
  rooms: {
    async getRooms() {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('number');
      if (error) throw error;
      return data;
    },
    async createRoom(room: Database['public']['Tables']['rooms']['Insert']) {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },
  maintenance: {
    async getRequests() {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select(`
          *,
          room:rooms(*),
          reporter:profiles(*)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    async createRequest(request: Database['public']['Tables']['maintenance_requests']['Insert']) {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert(request)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
  },
  notifications: {
    async getNotifications(userId: string) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    async markAsRead(notificationId: string) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      if (error) throw error;
    },
  },
}; 