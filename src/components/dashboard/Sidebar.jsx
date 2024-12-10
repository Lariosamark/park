import { useUser } from "../../providers/AuthProvider";
import { adminLinks, securityLinks, userLinks, vipLinks } from "../../lib/globals";
import { Link } from "react-router-dom";
import { auth } from "../../lib/firebase";
import Notifications from "./Notifications";

export function Sidebar() {
  const { user } = useUser();

  let links;

  switch (user.role) {
    case "Admin":
      links = adminLinks;
      break;
    case "Security":
      links = securityLinks;
      break;
    case "President":
      links = vipLinks;
      break;
    default:
      links = userLinks;
  }

  return (
    <div className="w-[300px] bg-red-950 flex flex-col sm:w-[100px]">
      <section className="flex items-center p-4 gap-4 justify-between">
        <img src="/logo.png" alt="logo" className=" h-10" />
        <h1 className="text-lg font-bold text-white">Parking System</h1>
        <Notifications count={10} />
      </section>
      <section className="flex flex-col">
        {links.map((link, i) => (
          <Link
            to={link.href}
            key={i}
            className="text-white/90 p-4 flex items-center gap-4 hover:bg-red-900"
          >
            <link.icon />
            <p className="md:hidden">{link.tag}</p>
          </Link>
        ))}
      </section>
      <section className="mt-auto p-4">
        <button
          className="w-full p-2 bg-red-700 rounded-md text-white"
          onClick={() => auth.signOut()}
        >
          Logout
        </button>
      </section>
    </div>
  );
}
