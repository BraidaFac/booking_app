// src/middleware.ts
import { auth } from "./lib/lucia";

import type { MiddlewareResponseHandler } from "astro";

const MAINTENANCE_PATH = "/moved";

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  const { pathname } = context.url;

  // Redirect all routes to maintenance page (except the page itself and API routes)
  if (pathname !== MAINTENANCE_PATH && !pathname.startsWith("/api/")) {
    return context.redirect(MAINTENANCE_PATH, 302);
  }

  context.locals.auth = auth.handleRequest(context);
  return await next();
};
