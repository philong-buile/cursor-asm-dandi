import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');

  // Check for OAuth errors
  if (error || errorDescription) {
    console.error('OAuth Error:', { error, errorDescription });
    return NextResponse.redirect(new URL('/', requestUrl.origin));
  }

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      console.log('Processing Google OAuth callback...');
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Error exchanging code for session:', error);
        return NextResponse.redirect(new URL('/', requestUrl.origin));
      }

      if (session) {
        console.log('Google authentication successful:', {
          user: session.user?.email,
          provider: session.user?.app_metadata?.provider
        });

        // Set the session cookie
        const { error: cookieError } = await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        });

        if (cookieError) {
          console.error('Error setting session cookie:', cookieError);
          return NextResponse.redirect(new URL('/', requestUrl.origin));
        }

        // The actual redirect will be handled by the Auth component
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Error in Google OAuth callback:', error);
      return NextResponse.redirect(new URL('/', requestUrl.origin));
    }
  }

  // If no code is present, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 