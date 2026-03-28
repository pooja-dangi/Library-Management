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
  type: "book",
  name: "",
  author: "",
  procurementDate: "",
  quantity: 1,
  serialNumber: "",
  status: "available",
};

export const BookPage = () => {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const selected = useMemo(() => rows.find((r) => r._id === selectedId) || null, [rows, selectedId]);

  const fetchNextId = async () => {
    try {
      const { data } = await http.get("/books/next-id");
      setForm((p) => ({ ...p, serialNumber: data.nextId }));
    } catch (e) {
      console.error("Failed to fetch next ID", e);
    }
  };

  const load = async () => {
    setApiError("");
    try {
      setLoading(true);
      const { data } = await http.get("/books");
      setRows(data);
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    fetchNextId();
  }, []);

  useEffect(() => {
    if (!selected) {
      if (selectedId === "" && form.name === "") {
        fetchNextId();
      }
      return;
    }
    setForm({
      type: selected.type || "book",
      name: selected.name || "",
      author: selected.author || "",
      procurementDate: selected.procurementDate ? selected.procurementDate.slice(0, 10) : "",
      quantity: selected.quantity ?? 1,
      serialNumber: selected.serialNumber || "",
      status: selected.status || "available",
    });
    setErrors({});
  }, [selectedId]);

  const onChange = (e) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "number" ? Number(value) : value }));
  };

  const validate = () => {
    const next = {};
    for (const k of ["type", "name", "author", "procurementDate", "serialNumber", "status"]) {
      if (!String(form[k] || "").trim()) next[k] = "Required";
    }
    if (!form.quantity || Number(form.quantity) < 1) next.quantity = "Quantity must be >= 1";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    try {
      setSaving(true);
      if (selectedId) await http.put(`/books/${selectedId}`, form);
      else await http.post("/books", form);
      setSelectedId("");
      setForm(blank);
      await load();
      await fetchNextId();
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!selectedId) return;
    if (!confirm("Delete this book?")) return;
    try {
      setSaving(true);
      await http.delete(`/books/${selectedId}`);
      setSelectedId("");
      setForm(blank);
      await load();
      await fetchNextId();
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
          name="bookSelect"
          className="h-4 w-4 accent-indigo-600"
          checked={selectedId === r._id}
          onChange={() => setSelectedId(r._id)}
        />
      ),
    },
    { key: "serialNumber", header: "Book ID" },
    { key: "name", header: "Name" },
    { key: "author", header: "Author" },
    { key: "quantity", header: "Qty" },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Book Management</h1>
        <p className="mt-1 text-sm text-gray-600">Add or update library books. All fields required.</p>
      </div>

      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title={selectedId ? "Update Book" : "Add Book"}>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Book ID"
              name="serialNumber"
              value={form.serialNumber}
              onChange={onChange}
              error={errors.serialNumber}
            />
            <Input label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
            <Input label="Author" name="author" value={form.author} onChange={onChange} error={errors.author} />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Date of Procurement"
                name="procurementDate"
                type="date"
                value={form.procurementDate}
                onChange={onChange}
                error={errors.procurementDate}
              />
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={onChange}
                error={errors.quantity}
              />
            </div>
            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={onChange}
              options={[
                { value: "available", label: "Available" },
                { value: "issued", label: "Issued" },
                { value: "lost", label: "Lost" },
                { value: "maintenance", label: "Maintenance" },
              ]}
              error={errors.status}
            />

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="secondary"
                disabled={saving}
                onClick={() => {
                  setSelectedId("");
                  setForm(blank);
                  setErrors({});
                  fetchNextId();
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

        <Card title="Books" subtitle="Select a row to update">
          {loading ? <Spinner /> : <Table columns={cols} rows={rows} rowKey={(r) => r._id} />}
        </Card>
      </div>
    </div>
  );
};


