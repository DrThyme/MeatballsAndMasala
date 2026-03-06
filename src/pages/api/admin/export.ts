import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../../lib/admin-auth';
import db from '../../../lib/db';

export const prerender = false;

interface RsvpRow {
  id: number;
  name: string;
  email: string;
  attending: number;
  guest_count: number | null;
  events: string | null;
  dietary: string | null;
  lodging: number | null;
  single_rooms: number | null;
  double_rooms: number | null;
  created_at: string;
}

function escapeCsv(value: string | number | null): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const GET: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request.headers.get('cookie'))) {
    return new Response('Unauthorized', { status: 401 });
  }

  const rows = db.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all() as RsvpRow[];

  const headers = ['ID', 'Name', 'Email', 'Attending', 'Guests', 'Events', 'Dietary', 'Lodging', 'Single Rooms', 'Double Rooms', 'Date'];
  const csvRows = rows.map((r) =>
    [r.id, r.name, r.email, r.attending ? 'Yes' : 'No', r.guest_count, r.events, r.dietary, r.lodging ? 'Yes' : 'No', r.single_rooms, r.double_rooms, r.created_at]
      .map(escapeCsv)
      .join(',')
  );

  const csv = [headers.join(','), ...csvRows].join('\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="rsvp-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
};
