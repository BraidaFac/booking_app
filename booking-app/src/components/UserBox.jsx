export default function UserBox(props) {
  const user = props.user;
  return (
    <details className="dropdown dropdown-left  self-end">
      <summary className="list-none">
        <div className="avatar placeholder mr-3 mt-3">
          <div
            tabIndex={0}
            className="btn bg-neutral text-neutral-content rounded-full w-12"
          >
            <span>
              {user.floor}/{user.flat}
            </span>
          </div>
        </div>
      </summary>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu mt-4  p-0 shadow bg-neutral rounded-box w-28"
      >
        <li>
          <a
            className="text-white"
            onClick={(e) => {
              e.preventDefault();
              fetch("http://localhost:4321/api/auth/logout", {
                method: "POST",
              }).then(() => {
                window.location.href = "/login";
              });
            }}
          >
            Salir
          </a>
        </li>
      </ul>
    </details>
  );
}
