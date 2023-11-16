import { useState, useEffect, useImperativeHandle } from "react";
import { parseISO } from "date-fns";
import Booking from "./Booking.jsx";
import React from "react";
import toast from "react-hot-toast";

function MyBookingContainer(props, ref) {
  const [bookings, setBookings] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const user = props.user;

  useImperativeHandle(ref, () => ({
    updateRefresh,
  }));
  function updateRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }
  useEffect(() => {
    fetch(`http://localhost:4321/api/user/${user.userId}`, { method: "GET" })
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
  }, [refresh]);

  const onDelete = async (id) => {
    const res = await fetch(`http://localhost:4321/api/booking/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      toast.success("Reserva cancelada");
      props.updateRefresh();
    } else {
      toast.error("No se pudo cancelar la reserva");
    }
  };
  return (
    <div className="flex flex-col gap-4 mt-5">
      <h2 className="text-4xl text-white text-center">Mis reservas</h2>

      {bookings.length === 0 ? (
        <p className="text-white text-center">No tenes reservas</p>
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
export default React.forwardRef(MyBookingContainer);
