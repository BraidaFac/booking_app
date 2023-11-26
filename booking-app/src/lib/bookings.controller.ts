import { prisma } from "./prisma";

export async function getBookings() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const all_bookings = await prisma.booking.findMany({
    include: { user: true },
  });
  return all_bookings.filter((booking) => booking.booking_date >= date);
}

export async function getBookingsById(id: string) {
  return await prisma.booking.findUnique({
    where: {
      id: id,
    },
    include: { user: true },
  });
}
export async function getBookingsByUserId(user_id: string) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const all_bookings = await prisma.booking.findMany({
    include: { user: true },
  });
  const user_bookings = all_bookings.filter(
    (booking) => booking.user_id === user_id && booking.booking_date >= date,
  );
  return user_bookings;
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
export async function deleteBooking(booking_id: string | undefined) {
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

export async function validateDeleteBooking(
  user_id: string,
  booking_id?: string,
) {
  if (!booking_id) {
    return { status: 400 };
  }
  const booking = await getBookingsById(booking_id);
  if (!booking) {
    return { status: 404 };
  }
  if (booking.user_id !== user_id) {
    return {
      status: 403,
    };
  }
}
