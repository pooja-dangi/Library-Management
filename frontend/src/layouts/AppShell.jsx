import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { Button } from "../components/ui/Button.jsx";

const NavItem = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
          isActive 
            ? "bg-indigo-600 text-white shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)]" 
            : "text-slate-400 hover:bg-white/5 hover:text-white"
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
    <div className="min-h-full">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 shadow-[0_0_15px_-3px_rgba(79,70,229,0.5)]" />
            <div>
              <p className="text-sm font-bold tracking-tight text-white uppercase italic">Library <span className="text-indigo-500">System</span></p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
                {user?.userId} • <span className="text-indigo-400">{user?.role}</span>
              </p>
            </div>
          </div>
          <Button variant="secondary" onClick={onLogout} className="px-4 py-2 text-xs">
            Logout
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 md:grid-cols-[260px_1fr]">
        <aside className="sticky top-24 self-start rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
          <nav className="flex flex-col gap-2">
            <NavItem to={isAdmin ? "/admin" : "/user"} label="Dashboard" />
            {isAdmin ? <NavItem to="/maintenance" label="Maintenance" /> : null}
            <NavItem to="/transactions" label="Transactions" />
            <NavItem to="/reports" label="Reports" />
          </nav>
        </aside>
        <main className="min-h-[70vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

