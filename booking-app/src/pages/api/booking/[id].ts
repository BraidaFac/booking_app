import type { APIRoute } from "astro";
import {
  deleteBooking,
  validateDeleteBooking,
} from "../../../lib/bookings.controller";
export const DELETE: APIRoute = async ({ request, params, locals }) => {
  const session = await locals.auth.validate();
  if (!session) return new Response("Unauthorized", { status: 401 });
  const user = session.user;
  const booking_id = params.id;
  const status_error = await validateDeleteBooking(user.userId, booking_id);
  if (status_error) {
    return new Response(null, { status: status_error.status });
  }
  const response = await deleteBooking(booking_id);
  return new Response(null, { status: response.status });
};
