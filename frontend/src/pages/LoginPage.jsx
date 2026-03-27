import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Alert } from "../components/ui/Alert.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ userId: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.userId.trim()) next.userId = "User ID is required";
    if (!form.password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    try {
      setLoading(true);
      const data = await login(form);
      navigate(data.role === "admin" ? "/admin" : "/user", { replace: true });
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Login</h1>
            <p className="mt-1 text-sm text-gray-600">Sign in with User ID and Password</p>
          </div>

          {apiError ? (
            <div className="mb-4">
              <Alert variant="error">{apiError}</Alert>
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="User ID" name="userId" value={form.userId} onChange={onChange} error={errors.userId} />
            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              error={errors.password}
            />

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="secondary" onClick={() => setForm({ userId: "", password: "" })} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner label="Signing in" /> : "Confirm"}
              </Button>
            </div>
          </form>

          <div className="mt-6 rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
            <p className="font-semibold text-gray-800">Seed logins</p>
            <p>Admin: admin001 / Admin@123</p>
            <p>User: user001 / User@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

