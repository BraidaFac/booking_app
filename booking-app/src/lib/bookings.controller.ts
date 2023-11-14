import { prisma } from "./prisma";

export async function getBookings() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return await prisma.booking.findMany({
    where: {
      booking_date: {
        gte: date,
      },
    },
    include: { user: true },
  });
}
export async function getBookingsByUserId(user_id: string) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return await prisma.booking.findMany({
    where: {
      user_id: user_id,
      AND: {
        booking_date: {
          gte: date,
        },
      },
    },
    include: { user: true },
  });
}

export async function createBooking(booking: {
  user_id: string;
  booking_date: string;
  shift: "MORNING" | "EVENING";
}) {
  booking = await sanitizaceInput(booking);
  try {
    await prisma.booking.create({
      data: booking,
    });
    return { status: 201, booking };
  } catch (error) {
    return { status: 500, error: error };
  }
}
export async function deleteBooking(booking_id: string) {
  try {
    await prisma.booking.delete({
      where: {
        id: booking_id,
      },
    });
    return { status: 204 };
  } catch (error) {
    return { status: 500, error };
  }
}

async function sanitizaceInput(input: {
  user_id: string;
  booking_date: string;
  shift: "MORNING" | "EVENING";
}) {
  const { user_id, booking_date, shift } = input;

  if (shift !== "MORNING" && shift !== "EVENING") {
    throw Error("Invalid shift");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });
  if (!user) {
    throw Error("Invalid user");
  }
  return input;
}
