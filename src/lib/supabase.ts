import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);
// Don't log the full key in production
console.log('Supabase key exists:', !!supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Test connection
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
});

// Test the connection
export async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test auth connection
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth connection error:', authError);
      throw authError;
    }
    console.log('Auth connection successful');

    // Test database connection
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.error('Profiles table not found - running initial setup');
        await setupDatabase();
      } else {
        console.error('Database connection error:', error);
        throw error;
      }
    }

    console.log('Successfully connected to Supabase');
    return true;
  } catch (error) {
    console.error('Error connecting to Supabase:', error);
    return false;
  }
}

async function setupDatabase() {
  try {
    // Create profiles table if it doesn't exist
    const { error: createError } = await supabase.rpc('setup_profiles_table');
    if (createError) throw createError;
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

// Add this function to test the connection
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('count');
    
    if (error) {
      console.error('Database connection error:', error);
      return false;
    }
    
    console.log('Database connection successful, row count:', data);
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
};

// Test the connection when the client is created
testConnection(); 