import { supabase } from '../lib/supabase';

export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
} 