export default function UserBox(props) {
  const user = props.user;
  return (
    <details className="dropdown dropdown-left absolute right-2 top-10">
      <summary className="list-none">
        <div className="avatar placeholder mr-3 mt-3">
          <div
            tabIndex={0}
            className="btn bg-neutral border-pink-200 text-neutral-content rounded-full w-12 hover:text-black"
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
              fetch("/api/auth/logout", {
                method: "POST",
              }).then(() => {
                window.location.href = "/login";
              });
            }}
          >
            Salir
          </a>
        </li>
        <li>
          <a className="text-white" href="/password">
            Password
          </a>
        </li>
      </ul>
    </details>
  );
}
