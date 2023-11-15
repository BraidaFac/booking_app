import { useState, useEffect } from "react";
import { parseISO } from "date-fns";
import Booking from "./Booking.jsx";

export default function BookingContainer(props) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = props.user;

  useEffect(() => {
    setLoading(true);
    fetch("/api/booking", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setBookings(
          data.map((booking) => {
            return {
              id: booking.id,
              shift: booking.shift,
              floor: booking.user.floor,
              flat: booking.user.flat,
              booking_date: parseISO(booking.booking_date),
            };
          }),
        );
      })
      .finally(() => setLoading(false))
      .catch((error) => console.log(error));
  }, []);
  const onDelete = async (id) => {
    const res = await fetch(`/api/booking/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      setBookings(bookings.filter((booking) => booking.id !== id));
    } else {
      alert("No se pudo cancelar la reserva");
    }
  };
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {!loading && bookings.length === 0 ? (
        <p className="text-white text-center">No existen reservas</p>
      ) : !loading ? (
        bookings.map((booking) => (
          <Booking
            key={booking.id}
            btnDisabled={booking.user_id !== user.userId}
            {...booking}
            onDelete={onDelete}
          />
        ))
      ) : (
        <span className="loading loading-spinner text-warning loading-lg"></span>
      )}
    </div>
  );
}
