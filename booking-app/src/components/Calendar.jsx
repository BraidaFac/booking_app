import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid/index.js";
import ModalShift from "./ModalShift.jsx";
import MyBookingContainer from "./MyBookingContainer.jsx";
import BookingContainer from "./BookingContainer.jsx";
import UserBox from "./UserBox.jsx";
import { Toaster } from "react-hot-toast";
import { formatMonth } from "../utils/date_formatter.ts";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  isSameYear,
} from "date-fns/index.js";
import { useState, useEffect, useRef } from "react";
import { isBefore } from "date-fns/fp/index.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
} /*  */

function isPass(day) {
  return isBefore(startOfToday(), day);
}

export default function Calendar(props) {
  const myBookingContainerRef = useRef(null);
  const bookingContainerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [bookingDay, setBookingDay] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const user = props.user;
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  useEffect(() => {
    fetch("/api/booking", { method: "GET" })
      .then((response) => response.json())
      .then((data) => {
        setBookings(
          data.map((booking) => {
            return { ...booking, booking_date: parseISO(booking.booking_date) };
          }),
        );
        containersRefresh();
      })
      .catch((error) => console.log(error));
  }, [refresh]);

  const updateRefresh = () => {
    setRefresh((prevRefresh) => !prevRefresh);
  };

  const containersRefresh = () => {
    bookingContainerRef.current.updateRefresh();
    myBookingContainerRef.current.updateRefresh();
  };

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });
  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function searchBookings(day) {
    const same_day_booking = bookings.filter((booking) => {
      return (
        isSameDay(day, booking.booking_date) &&
        isSameMonth(day, booking.booking_date) &&
        isSameYear(day, booking.booking_date)
      );
    });
    if (same_day_booking.length >= 0 && same_day_booking.length < 2) {
      setSelectedDay(day);
      setBookingDay(same_day_booking);
      setOpen(true);
    }
  }
  return (
    <div>
      <Toaster />
      <UserBox user={user} />
      <div className="flex flex-col md:mx-auto md:w-1/2  text-center px-2 my-2">
        <h2 className="text-4xl px-2 text-white">Reservas de turnos</h2>
        <h3 className="text-2xl px-2 text-white">Seleccione la fecha</h3>
      </div>
      <div className="p-3 md:p-5 md:w-1/3 mx-auto w-11/12  mt-10  bg-amber-50 rounded-lg shadow-lg shadow-white">
        <div className="flex items-center text-center">
          <button
            type="button"
            onClick={previousMonth}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400"
          >
            <ChevronLeftIcon className="w-8 h-8" aria-hidden="true" />
          </button>
          <h2 className="flex-auto font-semibold text-2xl text-gray-900 ">
            {formatMonth(firstDayCurrentMonth)}
          </h2>

          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <ChevronRightIcon className="w-8 h-8" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-primary">
          <div>D</div>
          <div>L</div>
          <div>M</div>
          <div>M</div>
          <div>J</div>
          <div>V</div>
          <div>S</div>
        </div>
        <div className="grid grid-cols-7 mt-2 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={classNames(
                dayIdx === 0 && colStartClasses[getDay(day)],
                "py-1.5",
              )}
            >
              <button
                disabled={
                  bookings.filter(
                    (booking) =>
                      isSameDay(day, booking.booking_date) &&
                      isSameMonth(day, booking.booking_date) &&
                      isSameYear(day, booking.booking_date),
                  ).length >= 2 || isPass(day)
                }
                type="button"
                onClick={() => {
                  searchBookings(day);
                }}
                className={classNames(
                  !isPass(day) &&
                    "disabled:text-red-400 disabled:cursor-not-allowed",
                  "text-gray-900",
                  isToday(day) && "text-white",
                  !isToday(day) && "text-gray-900",
                  isToday(day) && "bg-primary",
                  !isToday(day) && "bg-booking-card",
                  "enabled:hover:bg-gray-200",
                  isToday(day) && "font-semibold",
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
                  isPass(day) && "disabled:text-gray-400",
                )}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
      <ModalShift
        updateRefresh={updateRefresh}
        open={open}
        setOpen={setOpen}
        bookings={bookingDay}
        day={selectedDay}
        user={user}
      />
      <MyBookingContainer
        user={user}
        ref={myBookingContainerRef}
        updateRefresh={updateRefresh}
      />
      <BookingContainer
        user={user}
        ref={bookingContainerRef}
        updateRefresh={updateRefresh}
      />
    </div>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
