import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { LogIn } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const setProfile = useAuthStore((state) => state.setProfile);
  const location = useLocation();
  const message = location.state?.message;
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email
      });

      if (error) throw error;

      setError('Verification email resent. Please check your inbox.');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setNeedsVerification(false);

      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          setNeedsVerification(true);
          throw new Error('Please verify your email before logging in.');
        }
        throw authError;
      }

      if (user) {
        try {
          // Try to fetch existing profile
          let { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, role')
            .eq('id', user.id)
            .maybeSingle();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw new Error('Failed to load user profile');
          }

          // If no profile exists, create one
          if (!profile) {
            console.log('Creating new profile for user:', user.id);
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                email: user.email,
                full_name: user.email?.split('@')[0] || 'User',
                role: 'student'
              })
              .select('id, email, full_name, role')
              .single();

            if (createError) {
              console.error('Profile creation error:', createError);
              throw new Error('Failed to create user profile');
            }

            profile = newProfile;
          }

          if (!profile) {
            throw new Error('Failed to load or create user profile');
          }

          setUser(user);
          setProfile(profile);
          navigate('/dashboard');
        } catch (profileError: any) {
          console.error('Profile error:', profileError);
          throw new Error('Failed to load user profile. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-[#483285] hover:text-[#5a3fa6]">
              create a new account
            </Link>
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700">{message}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex flex-col">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              {needsVerification && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="mt-2 ml-3 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Resend verification email
                </button>
              )}
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#483285] focus:border-[#483285] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#483285] focus:border-[#483285] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#483285] hover:bg-[#5a3fa6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#483285] disabled:opacity-50"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-[#5a3fa6] group-hover:text-[#483285]" />
              </span>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 