// src/components/TechnicianDashboard/AssignedTasks.jsx
import React, { useEffect, useState } from "react";
import TechnicianLayout from "./TechnicianLayout";
import DownloadAssignedTasksReport from "./DownloadAssignedTasksReport";
import "./TechnicianDashboard.css";

function AssignedTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateTaskId, setUpdateTaskId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [search, setSearch] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [mockTasks] = useState([
    { _id: 'mock1', custom_id: 'PO-MOCK1', customerId: 'MOCK001', customerName: 'Mock Customer 1', product: 'Mock Solar Kit', total_amount: 100000, status: 'Pending', assigned_employee: { _id: 'mockEmp1', Employee_name: 'John Doe' }, assigned_date: new Date(), deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), order_date: new Date('2025-09-20') },
    { _id: 'mock2', custom_id: 'PO-MOCK2', customerId: 'MOCK002', customerName: 'Mock Customer 2', product: 'Mock Battery', total_amount: 50000, status: 'Pending', assigned_employee: { _id: 'mockEmp2', Employee_name: 'Jane Smith' }, assigned_date: new Date(), deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), order_date: new Date('2025-09-21') }, // Overdue
  ]); // Fallback

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/assignments/assigned-tasks");
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTasks(data || []);
      if (data.length === 0) setError("No assigned tasks found. Assign some via Dashboard.");
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

  const handleMarkDone = async (id) => {
    try {
      await fetch(`http://localhost:5000/assignments/mark-done/${id}`, { method: "PATCH" });
      fetchTasks();
    } catch (err) {
      alert("Failed to mark as done");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await fetch(`http://localhost:5000/assignments/delete/${id}`, { method: "DELETE" });
        fetchTasks();
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const openUpdateModal = async (taskId) => {
    setUpdateTaskId(taskId);
    setShowUpdateModal(true);
    setSelectedEmployee("");
    try {
      const res = await fetch("http://localhost:5000/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      setEmployees([]);
    }
  };

  const handleUpdateEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      await fetch(`http://localhost:5000/assignments/update-employee/${updateTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmployeeId: selectedEmployee }),
      });
      setShowUpdateModal(false);
      fetchTasks();
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredTasks = tasks
    .filter((task) => task.status !== "Done")
    .filter((task) => search === "" || 
      (task.customerName?.toLowerCase().includes(search.toLowerCase())) ||
      (task.product?.toLowerCase().includes(search.toLowerCase())) ||
      (task.custom_id?.toLowerCase().includes(search.toLowerCase()))
    )
    .filter((task) => filterEmployee === "" || task.assigned_employee?._id === filterEmployee)
    .filter((task) => filterStatus === "" || task.status === filterStatus);

  const resetFilters = () => {
    setSearch("");
    setFilterEmployee("");
    setFilterStatus("");
  };

  const handleExportCSV = () => {
    const csv = filteredTasks.map(task => 
      `${task.custom_id},${task.customerName},${task.product},${task.total_amount},${task.status},${task.assigned_employee?.Employee_name}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pending-tasks.csv';
    a.click();
  };

  if (loading) return <div className="loading">Loading pending tasks...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <TechnicianLayout>
      <h2>Pending Tasks ({filteredTasks.length})</h2>
      <p>Manage pending tasks with advanced filters, export options, and bulk actions.</p>

      {/* Advanced Filters */}
      <div className="search-filter-container">
        <input type="text" placeholder="Search by customer, product or order ID" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
        <select value={filterEmployee} onChange={(e) => setFilterEmployee(e.target.value)} className="filter-select">
          <option value="">All Employees</option>
          {allEmployees.map(emp => <option key={emp._id} value={emp._id}>{emp.Employee_name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
        </select>
        <button className="cta-button" onClick={resetFilters}>Reset Filters</button>
        <button className="cta-button primary" onClick={handleExportCSV}>Export CSV</button>
        <DownloadAssignedTasksReport tasks={filteredTasks} />
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No pending tasks</h3>
          <p>Assign tasks via Dashboard or create purchase orders.</p>
          <button className="cta-button primary" onClick={() => window.location.href = '/technicianDashboard'}>Go to Dashboard</button>
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
              <tr key={task._id} style={{ background: new Date(task.deadline) < new Date() && task.status !== "Done" ? "#ffcccc" : "" }}>
                <td>{task.custom_id}</td>
                <td>{task.customerId || "-"}</td>
                <td>{task.customerName || "-"}</td>
                <td>{task.product || "-"}</td>
                <td>Rs. {task.total_amount?.toLocaleString()}</td>
                <td>
                  <span style={{ color: task.status === "Done" ? "green" : (new Date(task.deadline) < new Date() ? "red" : "orange"), fontWeight: "bold" }}>
                    {task.status}
                  </span>
                </td>
                <td>{task.assigned_employee?.Employee_name || "-"}</td>
                <td>{task.assigned_date ? new Date(task.assigned_date).toLocaleString() : "-"}</td>
                <td>{task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}</td>
                <td>{task.order_date ? new Date(task.order_date).toLocaleDateString() : "-"}</td>
                <td>{task.notes || "-"}</td>
                <td>
                  <button className="cta-button primary" onClick={() => handleMarkDone(task._id)}>Mark as Done</button>
                  <button className="cta-button" onClick={() => openUpdateModal(task._id)}>Update Employee</button>
                  <button className="cta-button" style={{ background: "#dc3545" }} onClick={() => handleDelete(task._id)}>Delete</button>
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
          <option>Bulk Mark Done</option>
          <option>Bulk Reassign</option>
        </select>
        <button className="cta-button primary">Apply to Selected</button>
      </div>

      {/* Task Performance Chart */}
      <div className="chart-container">
        <h2>Task Performance Overview</h2>
        <Bar data={{
          labels: ['Pending', 'Overdue'],
          datasets: [{ label: 'Tasks', data: [filteredTasks.filter(t => t.status === 'Pending').length, filteredTasks.filter(t => new Date(t.deadline) < new Date()).length], backgroundColor: ['#ffc107', '#dc3545'] }]
        }} />
        <p>Visualize pending vs overdue tasks for better management.</p>
      </div>

      {/* Update Employee Modal */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Update Assigned Employee</h3>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.Employee_name}</option>
              ))}
            </select>
            <div style={{ marginTop: "15px" }}>
              <button className="cta-button primary" onClick={handleUpdateEmployee} disabled={!selectedEmployee}>Update</button>
              <button className="cta-button" onClick={() => setShowUpdateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </TechnicianLayout>
  );
}

export default AssignedTasks;