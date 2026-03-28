import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { useNavigate } from "react-router-dom";

export const MaintenanceHome = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Maintenance</h1>
        <p className="mt-1 text-sm text-slate-400">Admin-only maintenance operations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Book Management"
          subtitle="Add / update library books"
          right={<Button onClick={() => navigate("/maintenance/books")}>Open</Button>}
        />
        <Card
          title="User Management"
          subtitle="Add (register) / update users"
          right={<Button onClick={() => navigate("/maintenance/users")}>Open</Button>}
        />
      </div>
    </div>
  );
};

