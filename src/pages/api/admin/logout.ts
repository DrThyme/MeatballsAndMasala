import type { APIRoute } from 'astro';
import { clearCookie } from '../../../lib/admin-auth';

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin',
      'Set-Cookie': clearCookie(),
    },
  });
};
