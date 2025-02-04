import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

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
  global: {
    fetch: fetch.bind(globalThis)
  },
  db: {
    schema: 'public'
  }
});

let isInitializing = false;
let isInitialized = false;

export async function testConnection() {
  try {
    // Prevent multiple simultaneous initialization attempts
    if (isInitializing) {
      console.log('Connection test already in progress...');
      return false;
    }

    if (isInitialized) {
      console.log('Already initialized');
      return true;
    }

    isInitializing = true;
    console.log('Testing Supabase connection...');

    // Test auth connection first
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.error('Auth connection error:', authError);
      throw authError;
    }
    console.log('Auth connection successful');

    // Test database connection
    try {
      const { error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.error('Database connection error:', error);
        throw error;
      }

      console.log('Database connection successful');
      isInitialized = true;
      return true;
    } catch (dbError: any) {
      if (dbError.code === 'PGRST116' || dbError.code === '42P01') {
        // Table doesn't exist yet, but connection works
        console.log('No profiles table yet - this is OK for new setup');
        isInitialized = true;
        return true;
      }
      throw dbError;
    }
  } catch (error: any) {
    if (error?.message?.includes('Failed to fetch')) {
      console.error('Network connection error:', error);
      return false;
    }
    console.error('Error connecting to Supabase:', error);
    return false;
  } finally {
    isInitializing = false;
  }
}

// Initialize connection on load
testConnection().catch(console.error);

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