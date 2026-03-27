import { useEffect, useMemo, useState } from "react";
import { http } from "../../api/http.js";
import { Card } from "../../components/ui/Card.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Table } from "../../components/ui/Table.jsx";
import { Alert } from "../../components/ui/Alert.jsx";
import { Spinner } from "../../components/ui/Spinner.jsx";
import { Checkbox } from "../../components/ui/Checkbox.jsx";
import { getApiErrorMessage } from "../../utils/errors.js";

const toISODate = (d) => new Date(d).toISOString().slice(0, 10);
const addDays = (iso, days) => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

export const TransactionsHome = () => {
  const [books, setBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [apiError, setApiError] = useState("");

  // Availability
  const [avail, setAvail] = useState({ name: "", author: "" });
  const [availError, setAvailError] = useState("");
  const [availRows, setAvailRows] = useState([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");

  // Issue
  const today = toISODate(new Date());
  const [issueForm, setIssueForm] = useState({
    bookId: "",
    issueDate: today,
    returnDate: addDays(today, 15),
    remarks: "",
  });
  const [issueErrors, setIssueErrors] = useState({});
  const [issueSaving, setIssueSaving] = useState(false);

  // Return + Fine
  const [myTx, setMyTx] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [returnTxId, setReturnTxId] = useState("");
  const [actualReturnDate, setActualReturnDate] = useState(today);
  const [returnSaving, setReturnSaving] = useState(false);
  const [returnedTx, setReturnedTx] = useState(null);
  const [finePaid, setFinePaid] = useState(false);
  const [fineRemarks, setFineRemarks] = useState("");
  const [fineSaving, setFineSaving] = useState(false);

  const uniqueNames = useMemo(() => {
    const set = new Set(books.map((b) => b.name));
    return Array.from(set).sort();
  }, [books]);
  const uniqueAuthors = useMemo(() => {
    const set = new Set(books.map((b) => b.author));
    return Array.from(set).sort();
  }, [books]);

  const selectedBook = useMemo(() => books.find((b) => b._id === issueForm.bookId) || null, [books, issueForm.bookId]);

  const loadBooks = async () => {
    setApiError("");
    try {
      setLoadingBooks(true);
      const { data } = await http.get("/books");
      setBooks(data);
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setLoadingBooks(false);
    }
  };

  const loadTransactions = async () => {
    try {
      setTxLoading(true);
      const { data } = await http.get("/transactions");
      setMyTx(data);
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
    loadTransactions();
  }, []);

  const checkAvailability = async () => {
    setAvailError("");
    setApiError("");
    if (!avail.name && !avail.author) {
      setAvailError("At least one field is required (Book Name or Author).");
      return;
    }
    try {
      setAvailLoading(true);
      const { data } = await http.get("/transactions/availability", { params: { name: avail.name || undefined, author: avail.author || undefined } });
      setAvailRows(data);
      setSelectedBookId("");
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setAvailLoading(false);
    }
  };

  const validateIssue = () => {
    const next = {};
    if (!issueForm.bookId) next.bookId = "Required";
    if (!issueForm.issueDate) next.issueDate = "Required";
    if (!issueForm.returnDate) next.returnDate = "Required";
    if (issueForm.issueDate && issueForm.issueDate > today) next.issueDate = "Cannot be future";
    if (issueForm.issueDate && issueForm.returnDate) {
      const max = addDays(issueForm.issueDate, 15);
      if (issueForm.returnDate > max) next.returnDate = "Return date must be within 15 days";
    }
    setIssueErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitIssue = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateIssue()) return;
    try {
      setIssueSaving(true);
      await http.post("/transactions/issue", issueForm);
      await loadBooks();
      await loadTransactions();
      setIssueForm({ bookId: "", issueDate: today, returnDate: addDays(today, 15), remarks: "" });
    } catch (e2) {
      setApiError(getApiErrorMessage(e2));
    } finally {
      setIssueSaving(false);
    }
  };

  const issuedTx = useMemo(() => myTx.filter((t) => ["issued", "overdue"].includes(t.status)), [myTx]);

  const submitReturn = async () => {
    setApiError("");
    if (!returnTxId) return setApiError("Select a transaction to return.");
    if (!confirm("Confirm return? You will proceed to Fine Payment if applicable.")) return;
    try {
      setReturnSaving(true);
      const { data } = await http.post("/transactions/return", { transactionId: returnTxId, actualReturnDate });
      setReturnedTx(data);
      setFinePaid(false);
      setFineRemarks("");
      await loadBooks();
      await loadTransactions();
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setReturnSaving(false);
    }
  };

  const submitFine = async () => {
    setApiError("");
    if (!returnedTx) return;
    if (returnedTx.fine > 0 && !finePaid) {
      setApiError("If fine > 0, Fine Paid must be checked.");
      return;
    }
    try {
      setFineSaving(true);
      await http.post("/transactions/payfine", { transactionId: returnedTx._id, finePaid: !!finePaid, remarks: fineRemarks });
      setReturnedTx(null);
      await loadTransactions();
    } catch (e) {
      setApiError(getApiErrorMessage(e));
    } finally {
      setFineSaving(false);
    }
  };

  const availCols = [
    {
      key: "select",
      header: "",
      cell: (r) => (
        <input
          type="radio"
          name="availSelect"
          className="h-4 w-4 accent-indigo-600"
          checked={selectedBookId === r._id}
          onChange={() => setSelectedBookId(r._id)}
        />
      ),
    },
    { key: "name", header: "Book Name" },
    { key: "author", header: "Author" },
    { key: "serialNumber", header: "Serial No" },
    { key: "availability", header: "Availability" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <p className="mt-1 text-sm text-gray-600">Check availability, issue, return, and fine payment.</p>
      </div>

      {apiError ? <Alert variant="error">{apiError}</Alert> : null}
      {loadingBooks ? <Spinner label="Loading books..." /> : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Check Availability" subtitle="Search by Book Name OR Author (at least one)">
          <div className="space-y-4">
            <Select
              label="Book Name"
              name="name"
              value={avail.name}
              onChange={(e) => setAvail((p) => ({ ...p, name: e.target.value }))}
              options={[{ value: "", label: "Select", disabled: false }, ...uniqueNames.map((n) => ({ value: n, label: n }))]}
            />
            <Select
              label="Author"
              name="author"
              value={avail.author}
              onChange={(e) => setAvail((p) => ({ ...p, author: e.target.value }))}
              options={[{ value: "", label: "Select", disabled: false }, ...uniqueAuthors.map((a) => ({ value: a, label: a }))]}
            />
            {availError ? <Alert variant="error">{availError}</Alert> : null}
            <div className="flex justify-end">
              <Button onClick={checkAvailability} disabled={availLoading}>
                {availLoading ? <Spinner label="Searching" /> : "Confirm"}
              </Button>
            </div>
            <Table columns={availCols} rows={availRows} rowKey={(r) => r._id} />
          </div>
        </Card>

        <Card title="Issue Book" subtitle="Return date default +15 days (≤15 days)">
          <form onSubmit={submitIssue} className="space-y-4">
            <Select
              label="Book Name"
              name="bookId"
              value={issueForm.bookId}
              onChange={(e) => setIssueForm((p) => ({ ...p, bookId: e.target.value }))}
              error={issueErrors.bookId}
              options={[
                { value: "", label: "Select", disabled: false },
                ...books.map((b) => ({ value: b._id, label: `${b.name} (${b.serialNumber})` })),
              ]}
            />
            <Input label="Author" name="author" value={selectedBook?.author || ""} disabled />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Issue Date"
                name="issueDate"
                type="date"
                value={issueForm.issueDate}
                onChange={(e) => {
                  const issueDate = e.target.value;
                  setIssueForm((p) => ({ ...p, issueDate, returnDate: p.returnDate || addDays(issueDate, 15) }));
                }}
                error={issueErrors.issueDate}
              />
              <Input
                label="Return Date"
                name="returnDate"
                type="date"
                value={issueForm.returnDate}
                onChange={(e) => setIssueForm((p) => ({ ...p, returnDate: e.target.value }))}
                error={issueErrors.returnDate}
              />
            </div>
            <Input label="Remarks (optional)" name="remarks" value={issueForm.remarks} onChange={(e) => setIssueForm((p) => ({ ...p, remarks: e.target.value }))} />

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="secondary" disabled={issueSaving} onClick={() => setIssueForm({ bookId: "", issueDate: today, returnDate: addDays(today, 15), remarks: "" })}>
                Cancel
              </Button>
              <Button type="submit" disabled={issueSaving}>
                {issueSaving ? <Spinner label="Issuing" /> : "Confirm"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Return Book" subtitle="Select an active issue and confirm return">
          {txLoading ? (
            <Spinner label="Loading transactions..." />
          ) : (
            <div className="space-y-4">
              <Select
                label="Issued Transaction"
                name="transactionId"
                value={returnTxId}
                onChange={(e) => setReturnTxId(e.target.value)}
                options={[
                  { value: "", label: "Select", disabled: false },
                  ...issuedTx.map((t) => ({
                    value: t._id,
                    label: `${t.bookId?.name} (${t.bookId?.serialNumber}) - due ${t.returnDate?.slice(0, 10)}`,
                  })),
                ]}
              />
              <Input label="Actual Return Date" name="actualReturnDate" type="date" value={actualReturnDate} onChange={(e) => setActualReturnDate(e.target.value)} />
              <div className="flex justify-end">
                <Button onClick={submitReturn} disabled={returnSaving}>
                  {returnSaving ? <Spinner label="Returning" /> : "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card title="Pay Fine" subtitle="If fine > 0, Fine Paid must be checked">
          {!returnedTx ? (
            <Alert variant="info">Return a book to view fine details here.</Alert>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
                <p>
                  <span className="font-semibold">Book</span>: {returnedTx.bookId?.name} ({returnedTx.bookId?.serialNumber})
                </p>
                <p>
                  <span className="font-semibold">Author</span>: {returnedTx.bookId?.author}
                </p>
                <p>
                  <span className="font-semibold">Issue Date</span>: {returnedTx.issueDate?.slice(0, 10)}
                </p>
                <p>
                  <span className="font-semibold">Return Date</span>: {returnedTx.returnDate?.slice(0, 10)}
                </p>
                <p>
                  <span className="font-semibold">Actual Return Date</span>: {returnedTx.actualReturnDate?.slice(0, 10)}
                </p>
                <p>
                  <span className="font-semibold">Fine Calculated</span>: {returnedTx.fine ?? 0}
                </p>
              </div>

              <Checkbox label="Fine Paid" checked={finePaid} onChange={(e) => setFinePaid(e.target.checked)} />
              <Input label="Remarks (optional)" name="fineRemarks" value={fineRemarks} onChange={(e) => setFineRemarks(e.target.value)} />

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button variant="secondary" disabled={fineSaving} onClick={() => setReturnedTx(null)}>
                  Cancel
                </Button>
                <Button disabled={fineSaving} onClick={submitFine}>
                  {fineSaving ? <Spinner label="Submitting" /> : "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

