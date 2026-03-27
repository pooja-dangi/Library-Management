import { useEffect, useMemo, useState } from "react";
import { http } from "../../api/http.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { RadioGroup } from "../../components/ui/RadioGroup.jsx";
import { Checkbox } from "../../components/ui/Checkbox.jsx";
import { Table } from "../../components/ui/Table.jsx";
import { Alert } from "../../components/ui/Alert.jsx";
import { Spinner } from "../../components/ui/Spinner.jsx";
import { getApiErrorMessage } from "../../utils/errors.js";

export const UserManagementPage = () => {
  const [mode, setMode] = useState("new"); // new | existing
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({});

  const [newUser, setNewUser] = useState({
    name: "",
    userId: "",
    password: "",
    isActive: true,
    isAdmin: false,
  });

  const [editUser, setEditUser] = useState({
    name: "",
    isActive: true,
    isAdmin: false,
  });

  const selected = useMemo(() => rows.find((r) => r._id === selectedId) || null, [rows, selectedId]);

  const load = async () => {
    setApiError("");
    try {
      setLoading(true);
      const { data } = await http.get("/users");
      setRows(data);
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "existing") load();
  }, [mode]);

  useEffect(() => {
    if (!selected) return;
    setEditUser({
      name: selected.name || "",
      isActive: !!selected.isActive,
      isAdmin: selected.role === "admin",
    });
    setErrors({});
  }, [selectedId]);

  const validateNew = () => {
    const next = {};
    if (!newUser.name.trim()) next.name = "Required";
    if (!newUser.userId.trim()) next.userId = "Required";
    if (!newUser.password || newUser.password.length < 6) next.password = "Min 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateEdit = () => {
    const next = {};
    if (!editUser.name.trim()) next.name = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitNew = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateNew()) return;
    try {
      setSaving(true);
      await http.post("/auth/register", {
        name: newUser.name,
        userId: newUser.userId,
        password: newUser.password,
        role: newUser.isAdmin ? "admin" : "user",
        isActive: !!newUser.isActive,
      });
      setNewUser({ name: "", userId: "", password: "", isActive: true, isAdmin: false });
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!selectedId) return setApiError("Select an existing user");
    if (!validateEdit()) return;
    try {
      setSaving(true);
      await http.put(`/users/${selectedId}`, {
        name: editUser.name,
        isActive: !!editUser.isActive,
        role: editUser.isAdmin ? "admin" : "user",
      });
      await load();
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const cols = [
    {
      key: "select",
      header: "",
      cell: (r) => (
        <input
          type="radio"
          name="userSelect"
          className="h-4 w-4 accent-indigo-600"
          checked={selectedId === r._id}
          onChange={() => setSelectedId(r._id)}
        />
      ),
    },
    { key: "name", header: "Name" },
    { key: "userId", header: "User ID" },
    { key: "role", header: "Role" },
    { key: "isActive", header: "Active", cell: (r) => (r.isActive ? "Yes" : "No") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-600">Add (new) or update (existing) users.</p>
      </div>

      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <Card
        title="Mode"
        subtitle="Choose New User / Existing User"
        right={
          <RadioGroup
            name="mode"
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setSelectedId("");
              setErrors({});
            }}
            options={[
              { value: "new", label: "New User" },
              { value: "existing", label: "Existing User" },
            ]}
          />
        }
      >
        <div />
      </Card>

      {mode === "new" ? (
        <Card title="Add User">
          <form onSubmit={submitNew} className="space-y-4">
            <Input label="Name" name="name" value={newUser.name} onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))} error={errors.name} />
            <Input label="User ID" name="userId" value={newUser.userId} onChange={(e) => setNewUser((p) => ({ ...p, userId: e.target.value }))} error={errors.userId} />
            <Input label="Password" type="password" name="password" value={newUser.password} onChange={(e) => setNewUser((p) => ({ ...p, password: e.target.value }))} error={errors.password} />
            <div className="flex flex-wrap gap-6">
              <Checkbox label="Active" checked={newUser.isActive} onChange={(e) => setNewUser((p) => ({ ...p, isActive: e.target.checked }))} />
              <Checkbox label="Admin" checked={newUser.isAdmin} onChange={(e) => setNewUser((p) => ({ ...p, isAdmin: e.target.checked }))} />
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="secondary" disabled={saving} onClick={() => setNewUser({ name: "", userId: "", password: "", isActive: true, isAdmin: false })}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Spinner label="Creating" /> : "Confirm"}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Existing Users" subtitle="Select a user to update">
            {loading ? <Spinner /> : <Table columns={cols} rows={rows} rowKey={(r) => r._id} />}
          </Card>

          <Card title="Update User">
            <form onSubmit={submitEdit} className="space-y-4">
              <Input label="Name" name="name" value={editUser.name} onChange={(e) => setEditUser((p) => ({ ...p, name: e.target.value }))} error={errors.name} />
              <div className="flex flex-wrap gap-6">
                <Checkbox label="Active" checked={editUser.isActive} onChange={(e) => setEditUser((p) => ({ ...p, isActive: e.target.checked }))} />
                <Checkbox label="Admin" checked={editUser.isAdmin} onChange={(e) => setEditUser((p) => ({ ...p, isAdmin: e.target.checked }))} />
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                <Button variant="secondary" disabled={saving} onClick={() => setSelectedId("")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? <Spinner label="Saving" /> : "Confirm"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

