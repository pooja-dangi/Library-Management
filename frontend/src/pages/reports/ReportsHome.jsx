import { useEffect, useMemo, useState } from "react";
import { http } from "../../api/http.js";
import { Card } from "../../components/ui/Card.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Table } from "../../components/ui/Table.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Alert } from "../../components/ui/Alert.jsx";
import { Spinner } from "../../components/ui/Spinner.jsx";
import { getApiErrorMessage } from "../../utils/errors.js";

const reportOptions = [
  { value: "master_books", label: "Master List of Books" },
  { value: "master_movies", label: "Master List of Movies" },
  { value: "master_memberships", label: "Master List of Memberships" },
  { value: "active_issues", label: "Active Issues" },
  { value: "overdue_returns", label: "Overdue Returns" },
  { value: "pending_issue_requests", label: "Pending Issue Requests" },
];

const endpointByKey = {
  master_books: "/reports/master/books",
  master_movies: "/reports/master/movies",
  master_memberships: "/reports/master/memberships",
  active_issues: "/reports/active-issues",
  overdue_returns: "/reports/overdue-returns",
  pending_issue_requests: "/reports/pending-issue-requests",
};

export const ReportsHome = () => {
  const [reportKey, setReportKey] = useState("master_books");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const load = async () => {
    setApiError("");
    try {
      setLoading(true);
      const { data } = await http.get(endpointByKey[reportKey]);
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

  const columns = useMemo(() => {
    if (reportKey === "master_books" || reportKey === "master_movies") {
      return [
        { key: "name", header: "Name" },
        { key: "author", header: "Author" },
        { key: "serialNumber", header: "Serial No" },
        { key: "status", header: "Status" },
        { key: "quantity", header: "Qty" },
        { key: "procurementDate", header: "Procured", cell: (r) => (r.procurementDate ? r.procurementDate.slice(0, 10) : "") },
      ];
    }
    if (reportKey === "master_memberships") {
      return [
        { key: "memberId", header: "Member ID" },
        { key: "name", header: "Name" },
        { key: "contact", header: "Contact" },
        { key: "aadhaar", header: "Aadhaar" },
        { key: "membershipType", header: "Type" },
        { key: "status", header: "Status" },
        { key: "startDate", header: "Start", cell: (r) => (r.startDate ? r.startDate.slice(0, 10) : "") },
        { key: "endDate", header: "End", cell: (r) => (r.endDate ? r.endDate.slice(0, 10) : "") },
      ];
    }
    // transaction-based reports
    return [
      { key: "book", header: "Book", cell: (r) => r.bookId?.name || "" },
      { key: "author", header: "Author", cell: (r) => r.bookId?.author || "" },
      { key: "serial", header: "Serial No", cell: (r) => r.bookId?.serialNumber || "" },
      { key: "user", header: "User", cell: (r) => r.userId?.userId || "" },
      { key: "issueDate", header: "Issue Date", cell: (r) => (r.issueDate ? r.issueDate.slice(0, 10) : "") },
      { key: "returnDate", header: "Return Date", cell: (r) => (r.returnDate ? r.returnDate.slice(0, 10) : "") },
      { key: "actualReturnDate", header: "Actual Return", cell: (r) => (r.actualReturnDate ? r.actualReturnDate.slice(0, 10) : "") },
      { key: "fine", header: "Fine" },
      { key: "finePaid", header: "Fine Paid", cell: (r) => (r.finePaid ? "Yes" : "No") },
      { key: "status", header: "Status" },
    ];
  }, [reportKey]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-600">All reports are live from MongoDB.</p>
      </div>

      {apiError ? <Alert variant="error">{apiError}</Alert> : null}

      <Card
        title="Select Report"
        right={
          <div className="flex items-end gap-2">
            <div className="w-72">
              <Select
                label="Report"
                name="report"
                value={reportKey}
                onChange={(e) => setReportKey(e.target.value)}
                options={reportOptions}
              />
            </div>
            <Button onClick={load} disabled={loading}>
              {loading ? <Spinner label="Loading" /> : "Confirm"}
            </Button>
          </div>
        }
      >
        <div />
      </Card>

      <Card title={reportOptions.find((o) => o.value === reportKey)?.label || "Report"}>
        {loading ? <Spinner /> : <Table columns={columns} rows={rows} rowKey={(r) => r._id} />}
      </Card>
    </div>
  );
};

