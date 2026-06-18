import type { APIRoute } from "astro";
import { auth } from "../../../lib/lucia";
import { validatePasswordResetToken } from "../../../lib/token.controller";

export const POST: APIRoute = async ({ request, locals, params }) => {
  const { password } = await request.json();
  if (
    typeof password !== "string" ||
    password.length < 4 ||
    password.length > 255
  ) {
    return new Response("Invalid password", {
      status: 400,
    });
  }
  try {
    const token = params.token;
    if (!token) {
      return new Response("Invalid token", {
        status: 400,
      });
    }
    const userId = await validatePasswordResetToken(token);
    let user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateKeyPassword("username", user.username, password); // TODO: change to password

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const sessionCookie = auth.createSessionCookie(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (e) {
    return new Response("Invalid or expired password reset link", {
      status: 400,
    });
  }
};
