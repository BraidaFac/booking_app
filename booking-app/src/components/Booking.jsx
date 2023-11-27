import { formatDate } from "../utils/date_formatter";
import toast from "react-hot-toast";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
} /*  */
export default function Booking(props) {
  const { id, booking_date, shift, floor, flat, btnDisabled } = props;
  const onDelete = props.onDelete;
  return (
    <div className="booking px-4 py-2  mx-auto md:w-6/12 md:mx-auto  md:py-3 md:px-10  bg-amber-50 flex flex-col w-11/12 rounded-xl justify-center">
      <h2 className="text-2xl md:text-3xl">
        {formatDate(Number(booking_date))}
      </h2>
      <div className="flex flex-row justify-between items-center">
        <p className="text-gray-500 md:text-xl">
          Departamento {floor + "/" + flat}
        </p>
        <button
          disabled={btnDisabled}
          onClick={() => {
            toast(
              (t) => (
                <span className="block">
                  Estas seguro?
                  <div className="flex flex-row justify-between mt-2">
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        onDelete(id);
                        toast.dismiss(t.id);
                      }}
                    >
                      SI
                    </button>
                    <button
                      className="btn btn-sm  btn-error"
                      onClick={() => toast.dismiss(t.id)}
                    >
                      NO
                    </button>
                  </div>
                </span>
              ),
              {
                duration: 10000,
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="red"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>
                ),
              },
            );
          }}
          className="disabled:hidden text-red-400 text-xl p-1 cancel-booking"
        >
          Cancelar
        </button>
      </div>
      <div className="flex flex-row justify-between ">
        <p
          className={classNames(
            shift === "EVENING" && "text-primary",
            shift === "MORNING" && "text-primary",
            "text-center",
            "md:text-2xl text-xl",
          )}
        >
          {shift === "EVENING" ? "NOCHE" : "MEDIODIA"}
        </p>
      </div>
    </div>
  );
}
