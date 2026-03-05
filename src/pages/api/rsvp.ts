import type { APIRoute } from 'astro';
import db from '../../lib/db';

interface RsvpBody {
  name?: string;
  email?: string;
  attending?: boolean;
  guestCount?: number;
  events?: string[];
  dietary?: string;
  lodging?: boolean;
  singleRooms?: number;
  doubleRooms?: number;
}

function validate(body: RsvpBody): string[] {
  const errors: string[] = [];

  if (!body.name || body.name.trim().length === 0) {
    errors.push('Name is required');
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Valid email is required');
  }

  if (body.attending === undefined || body.attending === null) {
    errors.push('Please indicate if you are attending');
  }

  if (body.attending) {
    if (!body.guestCount || body.guestCount < 1 || body.guestCount > 10) {
      errors.push('Number of guests must be between 1 and 10');
    }

    if (!body.events || body.events.length === 0) {
      errors.push('Please select at least one event');
    }

    if (body.lodging) {
      const single = body.singleRooms ?? 0;
      const double = body.doubleRooms ?? 0;
      if (single + double < 1) {
        errors.push('Please select at least one room');
      }
      if (single < 0 || single > 5 || double < 0 || double > 5) {
        errors.push('Room count must be between 0 and 5');
      }
    }
  }

  return errors;
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: RsvpBody = await request.json();
    const errors = validate(body);

    if (errors.length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stmt = db.prepare(`
      INSERT INTO rsvps (name, email, attending, guest_count, events, dietary, lodging, single_rooms, double_rooms)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      body.name!.trim(),
      body.email!.trim().toLowerCase(),
      body.attending ? 1 : 0,
      body.attending ? body.guestCount : null,
      body.attending && body.events ? body.events.join(',') : null,
      body.attending && body.dietary ? body.dietary.trim() : null,
      body.attending ? (body.lodging ? 1 : 0) : null,
      body.attending && body.lodging ? (body.singleRooms ?? 0) : null,
      body.attending && body.lodging ? (body.doubleRooms ?? 0) : null,
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('RSVP error:', err);
    return new Response(JSON.stringify({ success: false, errors: ['Server error. Please try again.'] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
