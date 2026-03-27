import { Card } from "../../components/ui/Card.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { useNavigate } from "react-router-dom";

export const UserDashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Access transactions and reports.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Transactions"
          subtitle="Availability, request/issue, return, fine"
          right={<Button onClick={() => navigate("/transactions")}>Open</Button>}
        />
        <Card title="Reports" subtitle="View reports" right={<Button onClick={() => navigate("/reports")}>Open</Button>} />
      </div>
    </div>
  );
};

