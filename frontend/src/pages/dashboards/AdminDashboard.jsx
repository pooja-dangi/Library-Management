import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Access maintenance, transactions, and reports.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Maintenance"
          subtitle="Memberships, books/movies, users"
          right={<Button onClick={() => navigate("/maintenance")}>Open</Button>}
        />
        <Card
          title="Transactions"
          subtitle="Availability, issue, return, fine"
          right={<Button onClick={() => navigate("/transactions")}>Open</Button>}
        />
        <Card title="Reports" subtitle="Master lists & due reports" right={<Button onClick={() => navigate("/reports")}>Open</Button>} />
      </div>
    </div>
  );
};

