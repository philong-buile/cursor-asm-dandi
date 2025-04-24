'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Auth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboards');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isSignIn) {
        console.log('Starting sign in process...');
        console.log('Attempting sign in with:', { email: email.trim() });
        
        // Sign in and get the session
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        console.log('Sign in response:', { data, error });

        if (error) {
          console.error('Sign in error:', error);
          if (error.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
          } else if (error.message.includes('Email not confirmed')) {
            setError('Please verify your email before signing in. Check your inbox for the verification link.');
          } else {
            throw error;
          }
        } else {
          console.log('Sign in successful:', data);
          
          if (data.session) {
            console.log('Session data received:', {
              access_token: data.session.access_token ? 'Present' : 'Missing',
              refresh_token: data.session.refresh_token ? 'Present' : 'Missing',
              expires_at: data.session.expires_at,
              user: data.session.user?.email
            });

            // Use Supabase's session handling
            await supabase.auth.setSession({
              access_token: data.session.access_token,
              refresh_token: data.session.refresh_token
            });

            // Verify the session was set
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            console.log('Current session after set:', currentSession ? 'Present' : 'Missing');

            if (currentSession) {
              // Force a hard redirect to ensure session is properly set
              window.location.href = '/dashboards';
            } else {
              console.error('Failed to set session');
              setError('Failed to set session. Please try again.');
            }
          } else {
            console.error('No session data received after sign in');
            setError('Authentication error. Please try again.');
          }
        }
      } else {
        console.log('Attempting registration with:', { email: email.trim() });
        
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        if (error) {
          console.error('Registration error:', error);
          throw error;
        }
        
        if (data?.user?.identities?.length === 0) {
          setError('This email is already registered. Please sign in instead.');
        } else if (data?.user && !data?.user?.confirmed_at) {
          setError('Please check your email for the verification link. You need to verify your email before signing in.');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    console.log('Button clicked');
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        {isSignIn ? 'Sign In' : 'Register'}
      </h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              console.log('Email changed:', e.target.value);
              setEmail(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              console.log('Password changed');
              setPassword(e.target.value);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Your password (min. 6 characters)"
            minLength={6}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          onClick={handleButtonClick}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : isSignIn ? 'Sign In' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => {
            console.log('Switching mode');
            setIsSignIn(!isSignIn);
            setError(null);
          }}
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          {isSignIn ? "Don't have an account? Register" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
} 