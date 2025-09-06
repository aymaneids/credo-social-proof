#!/usr/bin/env node

console.log('🔍 Finding Supabase Credentials...\n');

// Try to find credentials from the browser's localStorage or frontend
console.log('To find your Supabase credentials:');
console.log('1. Open your browser and go to your app (http://localhost:5173)');
console.log('2. Open Developer Tools (F12)');
console.log('3. Go to Console tab');
console.log('4. Run this command:');
console.log('   console.log(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)');
console.log('');
console.log('OR');
console.log('');
console.log('1. Go to Application/Storage tab');
console.log('2. Look at Local Storage for your domain');
console.log('3. Look for keys containing "supabase"');
console.log('');
console.log('OR');
console.log('');
console.log('1. Go to Network tab');
console.log('2. Look for requests to supabase.co');
console.log('3. The URL will show your project URL');
console.log('');
console.log('Then update the .env file with the real values and restart the server.');