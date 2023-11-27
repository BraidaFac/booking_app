import type { APIRoute } from "astro";
import { createBooking, getBookings } from "../../../lib/bookings.controller";

export const POST: APIRoute = async ({ request, locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const booking: {
    user_id: string;
    booking_date: string;
    shift: "MORNING" | "EVENING";
    shared: boolean;
  } = await request.json();

  const response = await createBooking(booking);
  if (response && response.status === 201) {
    return new Response(JSON.stringify(response));
  }
  return new Response(JSON.stringify(null), {
    status: 400,
  });
};

export const GET: APIRoute = async ({ request }) => {
  const bookings = await getBookings();
  return new Response(JSON.stringify(bookings));
};
