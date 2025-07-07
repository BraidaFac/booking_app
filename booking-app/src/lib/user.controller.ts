import { prisma } from "./prisma";

export async function getUserByUsername(username: string) {
  return await prisma.user.findFirst({
    where: {
      username: username.toLowerCase(),
    },
  });
}
