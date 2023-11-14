// src/lib/lucia.ts
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { prisma } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

// expect error (see next section)
export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  middleware: astro(),
  adapter: prisma(client, {
    user: "user", // model User {}
    key: "key", // model Key {}
    session: "session", // model Session {}
  }),
  getUserAttributes: (data) => {
    return {
      username: data.username,
      flat: data.flat,
      floor: data.floor,
      role: data.role,
    };
  },
});

export type Auth = typeof auth;
