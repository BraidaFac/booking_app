import { Menu, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import ModalShift from "./ModalShift.jsx";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  isSameYear,
} from "date-fns";
import { Fragment, useState } from "react";
import bookings from "../data/booking.data.ts";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function isSameShift(shift1, shift2) {
  return shift1 === shift2;
}
export default function Calendar() {
  let [open, setOpen] = useState(false);
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(null);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  /* 
  let selectedDayMeetings = meetings.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  ); */

  function bookDay(day) {
    const same_day_booking = bookings.filter(
      (booking) =>
        isSameDay(day, booking.booking_date) &&
        isSameMonth(day, booking.booking_date) &&
        isSameYear(day, booking.booking_date),
    );
    if (same_day_booking.length >= 0 && same_day_booking.length < 2) {
      setOpen(true);
      setSelectedDay(same_day_booking);
    }
    /* bookings.push({
      id: bookings.length.toString(),
      booking_date: day,
      booking_time: Date.now(),
      flat: '5',
      shift: 'EVENING',
      floor: 1,
    }); */
  }

  return (
    <div className="md:pt-16 flex flex-row justify-center">
      <div className="p-3 md:p-5 w-80 md:w-1/3 bg-gray-100 rounded-lg shadow-lg shadow-white">
        <div className="flex items-center">
          <h2 className="flex-auto font-semibold text-gray-900 ">
            {format(firstDayCurrentMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={previousMonth}
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400"
          >
            <span className="sr-only text-red-600">Previous month</span>
            <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            onClick={nextMonth}
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-green-700">
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
                  ).length >= 2
                }
                type="button"
                onClick={() => {
                  bookDay(day);
                }}
                className={classNames(
                  "disabled:text-gray-400 disabled:cursor-not-allowed",
                  isEqual(day, selectedDay) && "text-white",
                  !isEqual(day, selectedDay) && isToday(day) && "text-red-500",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-900",
                  !isEqual(day, selectedDay) &&
                    !isToday(day) &&
                    !isSameMonth(day, firstDayCurrentMonth) &&
                    "text-gray-400",
                  isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                  isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                  "enabled:hover:bg-gray-200",
                  (isEqual(day, selectedDay) || isToday(day)) &&
                    "font-semibold",
                  "mx-auto flex h-8 w-8 items-center justify-center rounded-full",
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
      <ModalShift open={open} setOpen={setOpen} bookings={selectedDay} />
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
