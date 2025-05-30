import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('Middleware running for path:', req.nextUrl.pathname);
  
  // Skip middleware for auth callback route and Google Sign-In
  if (req.nextUrl.pathname === '/auth/callback' || req.nextUrl.pathname.includes('google')) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  
  try {
    // Create Supabase client
    const supabase = createMiddlewareClient({ req, res });
    
    // Try to get the session multiple times with a delay
    let session = null;
    let attempts = 0;
    const maxAttempts = 3;
    const delay = 200; // 1 second delay

    while (attempts < maxAttempts) {
      const { data, error } = await supabase.auth.getSession();
      session = data.session;
      
      console.log(`Session check attempt ${attempts + 1}:`, {
        hasSession: !!session,
        hasError: !!error,
        error: error?.message
      });

      if (session) {
        console.log('Session found:', {
          user: session.user?.email,
          expires_at: session.expires_at
        });
        break;
      }

      if (attempts < maxAttempts - 1) {
        console.log('No session found, waiting before retry...');
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      attempts++;
    }

    // If we have a session and user is on home page, redirect to dashboard
    if (session && req.nextUrl.pathname === '/') {
      console.log('Session found, redirecting to dashboard');
      return NextResponse.redirect(new URL('/dashboards', req.url));
    }

    // For all other cases, just continue with the request
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: ['/', '/dashboards/:path*', '/auth/callback'],
}; 