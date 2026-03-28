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
  const [activeTab, setActiveTab] = useState("user"); // "user" or "admin"
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
      
      // Basic check: if they logged in with the wrong role tab?
      // For now, we allow it but we redirect based on the ACTUAL role.
      // But it's better to stay on the correct dashboard.
      navigate(data.role === "admin" ? "/admin" : "/user", { replace: true });
    } catch (err) {
      setApiError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Background blobs for cinematic effect */}
      <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-blue-600/20 blur-[120px]" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-2xl">
          {/* Tabs */}
          <div className="flex border-b border-white/5">
            <button
              onClick={() => setActiveTab("user")}
              className={`flex-1 py-5 text-center text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "user"
                  ? "border-b-2 border-indigo-500 bg-indigo-500/10 text-indigo-400"
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              User Access
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex-1 py-5 text-center text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === "admin"
                  ? "border-b-2 border-violet-500 bg-violet-500/10 text-violet-400"
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              Admin Port
            </button>
          </div>

          <div className="p-10">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-indigo-600 shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)]" />
              <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
                Library <span className="text-indigo-500">System</span>
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-400">
                {activeTab === "user" ? "Enter your member credentials" : "Management portal login"}
              </p>
            </div>

            {apiError ? (
              <div className="mb-6">
                <Alert variant="error">{apiError}</Alert>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="space-y-6">
              <Input 
                label={`${activeTab === "user" ? "User" : "Admin"} ID`} 
                name="userId" 
                placeholder={activeTab === "user" ? "user001" : "admin001"}
                value={form.userId} 
                onChange={onChange} 
                error={errors.userId} 
              />
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={onChange}
                error={errors.password}
              />

              <div className="pt-4">
                <Button 
                  type="submit" 
                  fullWidth
                  variant="primary"
                  className={activeTab === "admin" ? "bg-violet-600 shadow-[0_0_20px_-5px_rgba(139,92,246,0.6)] hover:bg-violet-500" : ""}
                  disabled={loading}
                >
                  {loading ? <Spinner label="Authenticating" /> : "Secure Login"}
                </Button>
              </div>
            </form>

            <div className="mt-12 rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Demo Access</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">Admin:</span>
                  <code className="rounded-lg bg-white/10 px-2 py-1 text-indigo-300">admin001 / Admin@123</code>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">User:</span>
                  <code className="rounded-lg bg-white/10 px-2 py-1 text-indigo-300">user001 / User@123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


