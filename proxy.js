import { NextResponse } from 'next/server';

export function proxy(request) {
  const response = NextResponse.next();

  // Add origin guard for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const siteHeader = request.headers.get('x-site-request');
    if (!siteHeader || siteHeader !== 'true') {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Direct API access is restricted.' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return response;
}
