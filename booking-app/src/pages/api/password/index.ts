/* // src/pages/logout.ts

import type { APIRoute } from "astro";
import { prisma } from "../../../lib/prisma";
import { generatePasswordResetToken } from "../../../lib/token.controller";

export const POST: APIRoute = async ({ request, locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const user = session.user;
  const { email } = await request.json();
  // check email
  if (!isValidEmail(email)) {
    return new Response("Invalid email", {
      status: 400,
    });
  }
  try {
    const token = await generatePasswordResetToken(user.userId);
    await sendPasswordResetLink(token);
    return new Response(null, {
      status: 200,
    });
  } catch (e) {
    return new Response("An unknown error occurred", {
      status: 500,
    });
  }
};
function isValidEmail(email: string) {
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}
 */
