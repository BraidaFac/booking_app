import { generateRandomString, isWithinExpiration } from "lucia/utils";
import { prisma } from "./prisma";

const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

export const generatePasswordResetToken = async (userId: string) => {
  const storedUserTokens = await prisma.password_reset_token.findMany({
    where: {
      user_id: userId,
    },
  });
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(63);
  await prisma.password_reset_token.create({
    data: {
      id: token,
      expires: new Date().getTime() + EXPIRES_IN,
      user_id: userId,
    },
  });
  return token;
};

export const validatePasswordResetToken = async (token: string) => {
  const storedToken = await prisma.$transaction(async (trx) => {
    const storedToken = await trx.password_reset_token.findUnique({
      where: {
        id: token,
      },
    });
    if (!storedToken) throw new Error("Invalid token");
    await trx.password_reset_token.delete({
      where: {
        id: storedToken.id,
      },
    });
    return storedToken;
  });
  const tokenExpires = Number(storedToken.expires); // bigint => number conversion
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error("Expired token");
  }
  return storedToken.user_id;
};
