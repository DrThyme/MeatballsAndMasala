import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../../lib/admin-auth';
import db from '../../../../lib/db';

export const prerender = false;

export const DELETE: APIRoute = async ({ params, request }) => {
  if (!isAuthenticated(request.headers.get('cookie'))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: 'Invalid ID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = db.prepare('DELETE FROM rsvps WHERE id = ?').run(id);

  if (result.changes === 0) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
