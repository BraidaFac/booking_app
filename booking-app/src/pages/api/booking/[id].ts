import type { APIRoute } from "astro";
import { deleteBooking } from "../../../lib/bookings.controller";
export const DELETE: APIRoute = async ({ request, params }) => {
  const booking_id = params.id;
  if (!booking_id) {
    return new Response(null, {
      status: 400,
    });
  }
  const response = await deleteBooking(booking_id);
  return new Response(null, { status: response.status });
};

export const GET: APIRoute = async ({ request, params }) => {
  console.log("params", params);
  //const bookings = await getBookingsByUserId(params.user);
  //return new Response(JSON.stringify(bookings));
  return new Response(JSON.stringify("pepe"));
};
