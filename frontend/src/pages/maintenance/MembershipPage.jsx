import { useEffect, useMemo, useState } from "react";
import { http } from "../../api/http.js";
import { Card } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { RadioGroup } from "../../components/ui/RadioGroup.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Table } from "../../components/ui/Table.jsx";
import { Alert } from "../../components/ui/Alert.jsx";
import { Spinner } from "../../components/ui/Spinner.jsx";
import { getApiErrorMessage } from "../../utils/errors.js";

const blank = {
  memberId: "",
  name: "",
  contact: "",
  aadhaar: "",
  startDate: "",
  endDate: "",
  membershipType: "6_months",
  status: "active",
};

export const MembershipPage = () => {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const selected = useMemo(() => rows.find((r) => r._id === selectedId) || null, [rows, selectedId]);

  const load = async () => {
    setApiError("");
    try {
      setLoading(true);
      const { data } = await http.get("/memberships");
      setRows(data);
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setForm({
      memberId: selected.memberId || "",
      name: selected.name || "",
      contact: selected.contact || "",
      aadhaar: selected.aadhaar || "",
      startDate: selected.startDate ? selected.startDate.slice(0, 10) : "",
      endDate: selected.endDate ? selected.endDate.slice(0, 10) : "",
      membershipType: selected.membershipType || "6_months",
      status: selected.status || "active",
    });
    setErrors({});
  }, [selectedId]);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    for (const k of ["memberId", "name", "contact", "aadhaar", "startDate", "endDate", "membershipType"]) {
      if (!String(form[k] || "").trim()) next[k] = "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    try {
      setSaving(true);
      if (selectedId) await http.put(`/memberships/${selectedId}`, form);
      else await http.post("/memberships", form);
      setSelectedId("");
      setForm(blank);
      await load();
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!selectedId) return;
    if (!confirm("Delete this membership?")) return;
    try {
      setSaving(true);
      await http.delete(`/memberships/${selectedId}`);
      setSelectedId("");
      setForm(blank);
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
          name="membershipSelect"
          className="h-4 w-4 accent-indigo-600"
          checked={selectedId === r._id}
          onChange={() => setSelectedId(r._id)}
        />
      ),
    },
    { key: "memberId", header: "Member ID" },
    { key: "name", header: "Name" },
    { key: "contact", header: "Contact" },
    { key: "aadhaar", header: "Aadhaar" },
    { key: "membershipType", header: "Type" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Membership Management</h1>
        <p className="mt-1 text-sm text-gray-600">Add or update memberships. All fields are mandatory.</p>
      </div>

      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={selectedId ? "Update Membership" : "Add Membership"}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Member ID" name="memberId" value={form.memberId} onChange={onChange} error={errors.memberId} />
            <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
            <Input
              label="Contact Number"
              name="contact"
              value={form.contact}
              onChange={onChange}
              error={errors.contact}
            />
            <Input label="Aadhaar Card No" name="aadhaar" value={form.aadhaar} onChange={onChange} error={errors.aadhaar} />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Start Date"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={onChange}
                error={errors.startDate}
              />
              <Input
                label="End Date"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={onChange}
                error={errors.endDate}
              />
            </div>

            <RadioGroup
              label="Membership Type"
              name="membershipType"
              value={form.membershipType}
              onChange={onChange}
              error={errors.membershipType}
              options={[
                { value: "6_months", label: "6 months" },
                { value: "1_year", label: "1 year" },
                { value: "2_years", label: "2 years" },
              ]}
            />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={onChange}
              options={[
                { value: "active", label: "Active" },
                { value: "expired", label: "Expired" },
              ]}
            />

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="secondary"
                disabled={saving}
                onClick={() => {
                  setSelectedId("");
                  setForm(blank);
                  setErrors({});
                }}
              >
                Cancel
              </Button>
              <div className="flex gap-2">
                {selectedId ? (
                  <Button variant="danger" disabled={saving} onClick={onDelete}>
                    Delete
                  </Button>
                ) : null}
                <Button type="submit" disabled={saving}>
                  {saving ? <Spinner label="Saving" /> : "Confirm"}
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <Card title="Memberships" subtitle="Select a row to update">
          {loading ? <Spinner /> : <Table columns={cols} rows={rows} rowKey={(r) => r._id} />}
        </Card>
      </div>
    </div>
  );
};

