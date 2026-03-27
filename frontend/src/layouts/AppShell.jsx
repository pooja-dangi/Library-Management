import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-full bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Library Management System</p>
            <p className="text-xs text-gray-500">
              Signed in as {user?.name} ({user?.role})
            </p>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
          <nav className="flex flex-col gap-2">
            <NavItem to={isAdmin ? "/admin" : "/user"} label="Home" />
            {isAdmin ? <NavItem to="/maintenance" label="Maintenance" /> : null}
            <NavItem to="/transactions" label="Transactions" />
            <NavItem to="/reports" label="Reports" />
          </nav>
        </aside>
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

