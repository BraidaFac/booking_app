import { prisma } from "./prisma";

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: {
      username: username.toLowerCase(),
    },
  });
}
