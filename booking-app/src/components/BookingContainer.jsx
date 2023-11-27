import { useState, useEffect, useImperativeHandle, useRef } from "react";
import { parseISO } from "date-fns";
import Booking from "./Booking.jsx";
import React from "react";
import toast from "react-hot-toast";

function BookingContainer(props, ref) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);
  const user = props.user;

  function fetchBookings() {
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
              shared: booking.shared,
            };
          }),
        );
      })
      .finally(() => {
        setLoading(false);
      })
      .catch((error) => console.log(error));
  }
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setLoading(true);
      fetchBookings();
    }
  }, []);
  useImperativeHandle(ref, () => ({
    updateRefresh,
  }));
  function updateRefresh() {
    fetchBookings();
  }
  const onDelete = async (id) => {
    const res = await fetch(`/api/booking/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      props.updateRefresh();
      toast.success("Reserva cancelada");
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
    } else {
      toast.error("No se pudo cancelar la reserva");
      setTimeout(() => {
        toast.dismiss();
      }, 1000);
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
