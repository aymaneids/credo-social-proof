// Test Supabase Connection
// Run this in your browser's console to test the connection

console.log('Testing Supabase connection...');

// Test environment variables
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);

// Test Supabase client
import { supabase } from './src/lib/supabase.ts';

// Test basic connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection successful!', data);
  }
});

// Test if user is already logged in
supabase.auth.getUser().then(({ data, error }) => {
  if (error) {
    console.error('Error getting user:', error);
  } else {
    console.log('Current user:', data.user);
  }
});