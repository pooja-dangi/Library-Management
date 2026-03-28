import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Access maintenance, transactions, and reports.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-xl font-bold text-white">Maintenance</h2>
            <p className="mt-1 text-sm text-slate-300">Memberships, books, users</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/maintenance")}>Open Maintenance</Button>
        </div>

        <div className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-xl font-bold text-white">Transactions</h2>
            <p className="mt-1 text-sm text-slate-300">Availability, issue, return, fine</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/transactions")}>Open Transactions</Button>
        </div>

        <div className="flex flex-col items-start gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:bg-white/10 hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.1)]">
          <div>
            <h2 className="text-xl font-bold text-white">Reports</h2>
            <p className="mt-1 text-sm text-slate-300">Master lists & due reports</p>
          </div>
          <Button variant="primary" onClick={() => navigate("/reports")}>Open Reports</Button>
        </div>
      </div>
    </div>
  );
};

