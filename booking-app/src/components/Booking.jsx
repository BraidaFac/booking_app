import { formatDate } from "../utils/date_formatter";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
} /*  */
export default function Booking(props) {
  const { id, booking_date, shift, floor, flat, btnDisabled } = props;
  const onDelete = props.onDelete;
  return (
    <div className="booking px-4 py-2 mx-auto md:w-6/12 md:mx-auto mdrounded-md md:py-3 md:px-10 bg-white flex flex-col w-11/12 rounded-xl">
      <h2 className="text-2xl md:text-3xl">
        {formatDate(Number(booking_date))}
      </h2>
      <p className="text-gray-500 md:text-xl">
        Departamento {floor + "/" + flat}
      </p>
      <div className="flex flex-row justify-between ">
        <p
          className={classNames(
            shift === "EVENING" && "text-red-700",
            shift === "MORNING" && "text-green-700",
            "text-center",
            "md:text-2xl text-xl",
          )}
        >
          {shift === "EVENING" ? "NOCHE" : "MEDIODIA"}
        </p>

        <button
          disabled={btnDisabled}
          onClick={() => {
            if (
              confirm(
                `Estas seguro de cancelar la reserva para ${formatDate(
                  booking_date,
                )} ${shift === "EVENING" ? "a la noche" : "al mediodia"}?`,
              )
            ) {
              onDelete(id);
            }
          }}
          className="disabled:hidden rounded-3xl text-s p-1 border-solid border-2 border-red-600 hover:text-white hover:bg-red-500 cancel-booking"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
