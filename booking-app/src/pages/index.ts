import type { APIRoute } from "astro";
import "reflect-metadata";
import { User } from "../data/entities/user.entity";
import { MikroORM } from "@mikro-orm/mongodb";
import config from "../../mikro-orm.config.js";

export const GET: APIRoute = async ({ params, request }) => {
  const orm = await MikroORM.init(config);

  return new Response(
    JSON.stringify({
      message: "This was a GET!",
    }),
  );
};
