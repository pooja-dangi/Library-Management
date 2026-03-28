import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routing/ProtectedRoute.jsx";
import { AppShell } from "./layouts/AppShell.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { AdminDashboard } from "./pages/dashboards/AdminDashboard.jsx";
import { UserDashboard } from "./pages/dashboards/UserDashboard.jsx";
import { MaintenanceHome } from "./pages/maintenance/MaintenanceHome.jsx";
import { BookPage } from "./pages/maintenance/BookPage.jsx";
import { UserManagementPage } from "./pages/maintenance/UserManagementPage.jsx";
import { TransactionsHome } from "./pages/transactions/TransactionsHome.jsx";
import { ReportsHome } from "./pages/reports/ReportsHome.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />

          <Route element={<ProtectedRoute allowRoles={["admin"]} />}>
            <Route path="/maintenance" element={<MaintenanceHome />} />
            <Route path="/maintenance/books" element={<BookPage />} />
            <Route path="/maintenance/users" element={<UserManagementPage />} />
          </Route>

          <Route path="/transactions" element={<TransactionsHome />} />
          <Route path="/reports" element={<ReportsHome />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
