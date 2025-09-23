// src/components/TechnicianDashboard/MaintenanceRequests.jsx
import React, { useEffect, useState } from "react";
import TechnicianLayout from "./TechnicianLayout";
import ReactPaginate from "react-paginate";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./TechnicianDashboard.css";

function MaintenanceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ request_type: "Repair", description: "", location: "", priority: "Medium" });
  const [mockRequests] = useState([
    { _id: 'mock1', request_type: 'Repair', description: 'Fix panel', status: 'Pending', priority: 'High', location: 'Colombo', assigned_employee: { _id: 'mockEmp1', Employee_name: 'John Doe' }, deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
    { _id: 'mock2', request_type: 'Inspection', description: 'Annual check', status: 'Completed', priority: 'Medium', location: 'Kandy', assigned_employee: { _id: 'mockEmp2', Employee_name: 'Jane Smith' }, deadline: new Date() },
  ]); // Fallback

  useEffect(() => {
    fetchRequests();
  }, [search, filterStatus, filterPriority, currentPage]);

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/maintenances?page=${currentPage + 1}&limit=10&search=${search}&filterStatus=${filterStatus}&filterPriority=${filterPriority}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setRequests(data.requests || []);
      setPageCount(data.totalPages || 0);
      if (data.requests.length === 0) setError("No maintenance requests found. Create some below.");
    } catch (err) {
      console.error(err);
      setError("Failed to load requests. Using mock data.");
      setRequests(mockRequests);
    }
    setLoading(false);
  };

  const handleAssign = (id) => {
    setSelectedRequestId(id);
    setShowAssignModal(true);
    fetch("http://localhost:5000/employees").then(res => res.json()).then(setEmployees).catch(() => setEmployees([]));
  };

  const handleAssignConfirm = async () => {
    try {
      await fetch(`http://localhost:5000/maintenances/assign/${selectedRequestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployee }),
      });
      setShowAssignModal(false);
      fetchRequests();
    } catch (err) {
      alert("Assignment failed");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/maintenances/status/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchRequests();
    } catch (err) {
      alert("Status update failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirm delete?")) {
      try {
        await fetch(`http://localhost:5000/maintenances/${id}`, { method: "DELETE" });
        fetchRequests();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const handleCreateInput = (e) => {
    let value = e.target.value.replace(/[!#$%]/g, ""); // No special chars
    setCreateForm({ ...createForm, [e.target.name]: value });
  };

  const handleCreate = async () => {
    if (!createForm.description) return alert("Description required");
    try {
      await fetch("http://localhost:5000/maintenances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      setShowCreateModal(false);
      setCreateForm({ request_type: "Repair", description: "", location: "", priority: "Medium" });
      fetchRequests();
    } catch (err) {
      alert("Creation failed");
    }
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handleExportCSV = () => {
    const csv = requests.map(req => 
      `${req.request_type},${req.description},${req.status},${req.priority},${req.location}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance-requests.csv';
    a.click();
  };

  const chartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Requests',
        data: [requests.filter(r => r.status === 'Pending').length, requests.filter(r => r.status === 'In Progress').length, requests.filter(r => r.status === 'Completed').length],
        backgroundColor: ['#ffc107', '#007bff', '#28a745'],
      },
    ],
  };

  if (loading) return <div className="loading">Loading maintenance requests...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <TechnicianLayout>
      <h2>Maintenance Requests ({requests.length})</h2>
      <p>Full CRUD for maintenance requests with filters, charts, and export options.</p>

      {/* Advanced Filters */}
      <div className="search-filter-container">
        <input type="text" placeholder="Search by description" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="filter-select">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button className="cta-button primary" onClick={handleExportCSV}>Export CSV</button>
        <button className="cta-button primary" onClick={() => setShowCreateModal(true)}>Create New</button>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <h3>No maintenance requests</h3>
          <p>Create one below to get started.</p>
          <button className="cta-button primary" onClick={() => setShowCreateModal(true)}>Create Request</button>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Location</th>
              <th>Assigned Employee</th>
              <th>Request Date</th>
              <th>Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id} style={{ background: new Date(req.deadline) < new Date() && req.status !== "Completed" ? "#ffcccc" : "" }}>
                <td>{req._id.slice(-4)}</td>
                <td>{req.request_type}</td>
                <td>{req.description}</td>
                <td style={{ color: req.status === "Completed" ? "green" : (req.status === "Pending" ? "orange" : req.status === "In Progress" ? "#007bff" : "red") }}>{req.status}</td>
                <td style={{ color: req.priority === "High" ? "red" : req.priority === "Medium" ? "orange" : "green" }}>{req.priority}</td>
                <td>{req.location || "-"}</td>
                <td>{req.assigned_employee?.Employee_name || "-"}</td>
                <td>{new Date(req.request_date).toLocaleDateString()}</td>
                <td>{req.deadline ? new Date(req.deadline).toLocaleDateString() : "-"}</td>
                <td>
                  <button className="cta-button" onClick={() => handleAssign(req._id)}>Assign</button>
                  <select onChange={(e) => handleStatusUpdate(req._id, e.target.value)} value={req.status}>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                  <button className="cta-button" style={{ background: "#dc3545" }} onClick={() => handleDelete(req._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      {/* Bulk Actions */}
      <div className="bulk-actions">
        <h3>Bulk Actions</h3>
        <select>
          <option>Bulk Assign</option>
          <option>Bulk Status Update</option>
        </select>
        <button className="cta-button primary">Apply to Selected</button>
      </div>

      {/* Requests Chart */}
      <div className="chart-container">
        <h2>Requests Status Overview</h2>
        <Bar data={chartData} />
        <p>Visualize status distribution for prioritization.</p>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Employee</h3>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.Employee_name}</option>
              ))}
            </select>
            <button className="cta-button primary" onClick={handleAssignConfirm} disabled={!selectedEmployee}>Assign</button>
            <button className="cta-button" onClick={() => setShowAssignModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Maintenance Request</h3>
            <select value={createForm.request_type} onChange={handleCreateInput} name="request_type">
              <option value="Repair">Repair</option>
              <option value="Inspection">Inspection</option>
              <option value="Upgrade">Upgrade</option>
            </select>
            <textarea placeholder="Description" value={createForm.description} onChange={handleCreateInput} name="description" />
            <input placeholder="Location" value={createForm.location} onChange={handleCreateInput} name="location" />
            <select value={createForm.priority} onChange={handleCreateInput} name="priority">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button className="cta-button primary" onClick={handleCreate}>Create</button>
            <button className="cta-button" onClick={() => setShowCreateModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </TechnicianLayout>
  );
}

export default MaintenanceRequests;