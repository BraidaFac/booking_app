import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { formatDate } from "../utils/date_formatter.ts";
import toast from "react-hot-toast";
import { useLoadingState } from "../lib/loading_state.ts";

export default function ModalShift(props) {
  const [isLoading, setIsLoading] = useState(false);
  const cancelButtonRef = useRef(null);
  const { bookings, day, user, setOpen, updateRefresh } = props;
  let morning;
  let evening;
  const [shared, setShared] = useState(false);
  if (bookings) {
    morning = bookings.find((booking) => booking.shift === "MORNING");
    evening = bookings.find((booking) => booking.shift === "EVENING");
  }

  function bookShift(shift, exlusive) {
    setIsLoading(true);
    const booking = {
      user_id: user.userId,
      booking_date: day,
      shift: shift,
      shared: shared,
    };
    fetch("/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(booking),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data.status === 201) {
          updateRefresh();
          toast.success("Reserva exitosa");
          setTimeout(() => {
            toast.dismiss();
          }, 1000);
          setOpen(false);
        }
      })
      .catch((error) => {
        console.log(error);

        toast.error("Error al reservar turno");
      });
  }

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => props.setOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center  sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                {isLoading ? (
                  <div className="text-center h-32 py-10 w-80">
                    <span className="loading loading-spinner text-warning loading-lg"></span>
                  </div>
                ) : (
                  <div className="bg-gray-50 px-4 py-4 flex flex-col justify-around sm:px-6 w-80 sm:w-full">
                    <div className="text-center justify-items-start">
                      <p className="text-sm md:text-lg font-semibold">
                        {day && formatDate(day)}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={morning}
                      className="inline-flex w-full justify-center rounded-md bg-pink-1  px-3 py-2 text-sm font-semibold text-white shadow-sm   sm:w-auto disabled:bg-slate-300 mb-3 mt-3"
                      onClick={() => bookShift("MORNING")}
                    >
                      Mediodia
                    </button>
                    <button
                      type="button"
                      disabled={evening}
                      className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm   sm:w-auto 
                      disabled:bg-slate-300"
                      onClick={() => bookShift("EVENING")}
                      ref={cancelButtonRef}
                    >
                      Noche
                    </button>
                    <div className="mt-4 text-center">
                      <label className="text-sm md:text-lg font-semibold ">
                        Compartido
                      </label>
                      <input
                        className="form-checkbox h-5 w-5 bg-primary ml-3"
                        type="checkbox"
                        onChange={() => setShared(!shared)}
                      />
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
