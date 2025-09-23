// src/components/TechnicianDashboard/CompletedTasks.jsx
import React, { useEffect, useState } from "react";
import TechnicianLayout from "./TechnicianLayout";
import DownloadAssignedTasksReport from "./DownloadAssignedTasksReport";
import "./TechnicianDashboard.css";

function CompletedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState({ report_details: '', rating: 5, comments: '' });
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [mockTasks] = useState([
    { _id: 'mock1', custom_id: 'PO-MOCK1', customerId: 'MOCK001', customerName: 'Mock Customer 1', product: 'Mock Solar Kit', total_amount: 100000, status: 'Done', assigned_employee: { _id: 'mockEmp1', Employee_name: 'John Doe' }, assigned_date: new Date(), deadline: new Date(), order_date: new Date('2025-09-20') },
    { _id: 'mock2', custom_id: 'PO-MOCK2', customerId: 'MOCK002', customerName: 'Mock Customer 2', product: 'Mock Battery', total_amount: 50000, status: 'Done', assigned_employee: { _id: 'mockEmp2', Employee_name: 'Jane Smith' }, assigned_date: new Date(), deadline: new Date(), order_date: new Date('2025-09-21') },
  ]); // Fallback

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/assignments/assigned-tasks");
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTasks(data || []);
      if (data.filter(t => t.status === 'Done').length === 0) setError("No completed tasks found. Mark some as done.");
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks. Using mock data.");
      setTasks(mockTasks);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
    fetch("http://localhost:5000/employees")
      .then((res) => res.json())
      .then(setAllEmployees)
      .catch(() => setAllEmployees([]));
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/assignments/delete/${id}`, { method: "DELETE" });
      fetchTasks();
    } catch (err) {
      alert("Delete failed");
    }
    setShowConfirm(false);
    setDeleteId(null);
  };

  const openReportModal = (taskId) => {
    setSelectedTaskId(taskId);
    setShowReportModal(true);
    setReportForm({ report_details: '', rating: 5, comments: '' });
  };

  const handleSubmitReport = async () => {
    if (!reportForm.report_details) return alert("Details required");
    try {
      await fetch("http://localhost:5000/jobreports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...reportForm, job_id: selectedTaskId, job_type: 'PurchaseOrder', technician_id: tasks.find(t => t._id === selectedTaskId)?.assigned_employee?._id }),
      });
      setShowReportModal(false);
      alert("Report submitted!");
    } catch (err) {
      alert("Report submission failed");
    }
  };

  const filteredTasks = tasks
    .filter((task) => task.status === "Done")
    .filter((task) => search === "" || 
      (task.customerName?.toLowerCase().includes(search.toLowerCase())) ||
      (task.product?.toLowerCase().includes(search.toLowerCase())) ||
      (task.custom_id?.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((task) => filterEmployee === "" || task.assigned_employee?._id === filterEmployee);

  const resetFilters = () => {
    setSearch("");
    setFilterEmployee("");
  };

  const handleExportCSV = () => {
    const csv = filteredTasks.map(task => 
      `${task.custom_id},${task.customerName},${task.product},${task.total_amount},${task.status}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'completed-tasks.csv';
    a.click();
  };

  if (loading) return <div className="loading">Loading completed tasks...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <TechnicianLayout>
      <h2>Completed Tasks ({filteredTasks.length})</h2>
      <p>Review completed tasks, submit reports, export data, and perform bulk actions.</p>

      {/* Advanced Filters */}
      <div className="search-filter-container">
        <input type="text" placeholder="Search by customer, product or order ID" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
        <select value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} className="filter-select">
          <option value="">All Employees</option>
          {allEmployees.map(emp => <option key={emp._id} value={emp._id}>{emp.Employee_name}</option>)}
        </select>
        <button className="cta-button" onClick={resetFilters}>Reset Filters</button>
        <button className="cta-button primary" onClick={handleExportCSV}>Export CSV</button>
        <DownloadAssignedTasksReport tasks={filteredTasks} />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No completed tasks</h3>
          <p>Mark pending tasks as done to see them here.</p>
          <button className="cta-button primary" onClick={() => window.location.href = '/technicianDashboard/assigned-tasks'}>Go to Pending Tasks</button>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Assigned Employee</th>
              <th>Assigned Date</th>
              <th>Deadline</th>
              <th>Order Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task._id}>
                <td>{task.custom_id}</td>
                <td>{task.customerId || "-"}</td>
                <td>{task.customerName || "-"}</td>
                <td>{task.product || "-"}</td>
                <td>Rs. {task.total_amount?.toLocaleString()}</td>
                <td><span style={{ color: "green", fontWeight: "bold" }}>{task.status}</span></td>
                <td>{task.assigned_employee?.Employee_name || "-"}</td>
                <td>{task.assigned_date ? new Date(task.assigned_date).toLocaleString() : "-"}</td>
                <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}</td>
                <td>{task.order_date ? new Date(task.order_date).toLocaleDateString() : "-"}</td>
                <td>{task.notes || "-"}</td>
                <td>
                  <button className="cta-button" onClick={() => openReportModal(task._id)}>Submit Report</button>
                  <button className="cta-button" style={{ background: "#dc3545", color: "#fff" }} onClick={() => { setDeleteId(task._id); setShowConfirm(true); }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <h3>Bulk Actions</h3>
        <select>
          <option>Bulk Delete</option>
          <option>Bulk Archive</option>
        </select>
        <button className="cta-button primary">Apply to Selected</button>
      </div>

      {/* Completion Rate Chart */}
      <div className="chart-container">
        <h2>Completion Rate Overview</h2>
        <Bar data={{
          labels: ['Completed', 'Total Assigned'],
          datasets: [{ label: 'Tasks', data: [filteredTasks.length, tasks.length], backgroundColor: ['#28a745', '#ffc107'] }]
        }} />
        <p>Track completion rates for performance review.</p>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Delete this completed task?</p>
            <div style={{ marginTop: "18px", display: "flex", justifyContent: "center", gap: "16px" }}>
              <button className="cta-button primary" style={{ background: "#dc3545" }} onClick={() => handleDelete(deleteId)}>
                Yes, Delete
              </button>
              <button className="cta-button" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit Job Report</h3>
            <textarea placeholder="Report details" value={reportForm.report_details} onChange={(e) => setReportForm({ ...reportForm, report_details: e.target.value })} />
            <select value={reportForm.rating} onChange={(e) => setReportForm({ ...reportForm, rating: parseInt(e.target.value) })}>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}/5</option>)}
            </select>
            <textarea placeholder="Comments" value={reportForm.comments} onChange={(e) => setReportForm({ ...reportForm, comments: e.target.value })} />
            <button className="cta-button primary" onClick={handleSubmitReport}>Submit Report</button>
            <button className="cta-button" onClick={() => setShowReportModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </TechnicianLayout>
  );
}

export default CompletedTasks;