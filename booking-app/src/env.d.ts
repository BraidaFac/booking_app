/// <reference types="astro/client" />

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./lib/lucia").Auth;
  type DatabaseUserAttributes = {
    username: string;
    flat: string;
    floor: string;
    role: "USER" | "ADMIN";
  };
  type DatabaseSessionAttributes = {};
}
/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    auth: import("lucia").AuthRequest;
  }
}
