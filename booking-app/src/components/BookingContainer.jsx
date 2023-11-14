import { useState, useEffect } from "react";
import { formatDate } from "../utils/date_formatter";
import { parseISO } from "date-fns";
import { el } from "date-fns/locale";
import Booking from "./Booking.jsx";

export default function BookingContainer(props) {
  const [bookings, setBookings] = useState([]);
  const user = props.user;

  function updateRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }
  useEffect(() => {
    console.log("useEffect");
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
    <div className="flex flex-col gap-4 mt-8">
      {bookings.length === 0 ? (
        <p className="text-white text-center">No existen reservas</p>
      ) : (
        bookings.map((booking) => (
          <Booking
            key={booking.id}
            btnDisabled={booking.user_id !== user.id}
            {...booking}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
