import type { APIRoute } from "astro";
import { getBookingsByUserId } from "../../../lib/bookings.controller";

export const GET: APIRoute = async ({ locals, params }) => {
  const session = await locals.auth.validate();
  if (!session) return new Response("Unauthorized", { status: 401 });
  const user_id = params.user;
  if (!user_id) {
    return new Response(null, {
      status: 400,
    });
  }
  const bookings = await getBookingsByUserId(user_id);
  return new Response(JSON.stringify(bookings));
};
