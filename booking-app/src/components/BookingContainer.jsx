import { useState, useEffect, useImperativeHandle } from "react";
import { parseISO } from "date-fns";
import Booking from "./Booking.jsx";
import React from "react";
import toast from "react-hot-toast";

function BookingContainer(props, ref) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

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
              user_id: booking.user.id,
            };
          }),
        );
      })
      .finally(() => setLoading(false))
      .catch((error) => console.log(error));
  }, [refresh]);
  useImperativeHandle(ref, () => ({
    updateRefresh,
  }));
  function updateRefresh() {
    setRefresh((prevRefresh) => !prevRefresh);
  }
  const onDelete = async (id) => {
    const res = await fetch(`/api/booking/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      props.updateRefresh();
      toast.success("Reserva cancelada", { duration: 1000 });
    } else {
      toast.error("No se pudo cancelar la reserva", { duration: 1000 });
    }
  };
  return (
    <div className="flex flex-col items-center gap-4 my-8">
      <h2 className=" text-4xl text-white text-center">Otras reservas</h2>

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
export default React.forwardRef(BookingContainer);
