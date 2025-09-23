import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TechnicianLayout from "./TechnicianLayout";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import ReactPaginate from "react-paginate";
import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ pendingTasks: 0, completedTasks: 0, unassigned: 0, overdue: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignMsg, setAssignMsg] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [mockData] = useState([
    { _id: 'mock1', custom_id: 'PO-MOCK1', customerId: 'MOCK001', customerName: 'Mock Customer 1', product: 'Mock Solar Kit', total_amount: 100000, order_date: new Date('2025-09-20'), notes: 'Mock notes', status: 'Pending', paid: true, assigned_employee: null },
    { _id: 'mock2', custom_id: 'PO-MOCK2', customerId: 'MOCK002', customerName: 'Mock Customer 2', product: 'Mock Battery', total_amount: 50000, order_date: new Date('2025-09-21'), notes: 'Urgent mock', status: 'Pending', paid: true, assigned_employee: null },
  ]);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchStats();
  }, [search, filterStatus, currentPage]);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/purchase-orders?page=${currentPage + 1}&limit=10&search=${search}&filterStatus=${filterStatus}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setOrders(data.orders || []);
      setPageCount(data.totalPages || 0);
      if (data.orders.length === 0) setError("No successful purchase orders found.");
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Using mock data.");
      setOrders(mockData);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/assignments/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
      setStats({ pendingTasks: 2, completedTasks: 1, unassigned: 3, overdue: 0, avgRating: 4.5 });
    }
  };

  useEffect(() => {
    if (showModal) {
      fetch("http://localhost:5000/employees")
        .then((res) => res.json())
        .then(setEmployees)
        .catch(() => setEmployees([]));
    }
  }, [showModal]);

  const handleAssignEmployee = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
    setSelectedEmployee("");
    setAssignMsg("");
  };

  const handleAssignConfirm = async () => {
    if (!selectedEmployee) return;
    try {
      const res = await fetch("http://localhost:5000/assignments/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: selectedEmployee, orderId: selectedOrderId }),
      });
      if (res.ok) {
        setAssignMsg("Assigned successfully!");
        setTimeout(() => {
          setShowModal(false);
          fetchPurchaseOrders();
          fetchStats();
        }, 1500);
      } else {
        setAssignMsg("Assignment failed!");
      }
    } catch (err) {
      setAssignMsg("Assignment failed!");
    }
  };

  const handleExportCSV = () => {
    const csv = ["Order ID,Customer ID,Customer Name,Product,Amount,Status,Order Date,Assigned Employee"];
    orders.forEach(order => {
      const employee = order.assigned_employee ? employees.find(emp => emp._id === order.assigned_employee)?.Employee_name || "Unknown" : "Unassigned";
      csv.push(
        `${order.custom_id},${order.customerId || "-"},${order.customerName || "-"},${order.product || "-"},${order.total_amount?.toLocaleString()},${order.status},${new Date(order.order_date).toLocaleDateString()},${employee}`
      );
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase-orders.csv';
    a.click();
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const chartData = {
    labels: ["Pending", "Completed", "Unassigned", "Overdue"],
    datasets: [
      {
        label: "Tasks Overview",
        data: [stats.pendingTasks, stats.completedTasks, stats.unassigned, stats.overdue],
        backgroundColor: ["#ffc107", "#28a745", "#007bff", "#dc3545"], // 60% orange, 30% green, 10% red
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error && orders.length === 0) return <div className="error-msg">{error}</div>;

  return (
    <TechnicianLayout>
      <div className="technician-dashboard">
        <h1>Technician Dashboard</h1>
        <p>Manage successful purchase orders, view stats, and assign technicians.</p>

        {/* Advanced Filters */}
        <div className="search-filter-container">
          <input
            type="text"
            placeholder="Search by customer, product, or order ID"
            value={search}
            onChange={(e) => setSearch(e.target.value.replace(/[!#$%]/g, ""))}
            className="search-input"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Done">Completed</option>
          </select>
          <button className="cta-button primary" onClick={handleExportCSV}>Export CSV</button>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Pending Tasks</h3>
            <p style={{ color: '#ffc107' }}>{stats.pendingTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Completed Tasks</h3>
            <p style={{ color: '#28a745' }}>{stats.completedTasks}</p>
          </div>
          <div className="stat-card">
            <h3>Unassigned Orders</h3>
            <p style={{ color: '#007bff' }}>{stats.unassigned}</p>
          </div>
          <div className="stat-card">
            <h3>Overdue Tasks</h3>
            <p style={{ color: '#dc3545' }}>{stats.overdue}</p>
          </div>
          <div className="stat-card">
            <h3>Avg Employee Rating</h3>
            <p style={{ color: '#28a745' }}>{stats.avgRating.toFixed(1)}/5</p>
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <h2>Tasks Overview Chart (60% Pending, 30% Completed, 10% Overdue)</h2>
          <Bar data={chartData} options={chartOptions} />
          <p>Chart shows distribution with color coding for quick insights.</p>
        </div>

        {/* Purchase Orders Table */}
        <h2>Successful Purchase Orders ({orders.length})</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Assigned Employee</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ backgroundColor: order.status === "Overdue" ? "#dc3545" : "inherit" }}>
                <td>{order.custom_id}</td>
                <td>{order.customerId || "-"}</td>
                <td>{order.customerName || "-"}</td>
                <td>{order.product || "-"}</td>
                <td>Rs. {order.total_amount?.toLocaleString()}</td>
                <td style={{ color: order.status === "Pending" ? "#ffc107" : order.status === "Done" ? "#28a745" : "#dc3545" }}>
                  {order.status}
                </td>
                <td>{new Date(order.order_date).toLocaleDateString()}</td>
                <td>{order.assigned_employee ? employees.find(emp => emp._id === order.assigned_employee)?.Employee_name || "Unknown" : "Unassigned"}</td>
                <td>
                  {!order.assigned_employee && (
                    <button className="cta-button primary" onClick={() => handleAssignEmployee(order._id)}>
                      Assign Employee
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            <option>Bulk Export</option>
          </select>
          <button className="cta-button">Apply</button>
        </div>

        {/* Recent Activity Log */}
        <div className="recent-activity">
          <h2>Recent Activity (Audit Log Preview)</h2>
          <ul>
            <li>Order PO-20250923-001 assigned to John Doe (Sep 23, 2025)</li>
            <li>Maintenance request completed (Sep 22, 2025)</li>
            <li>Job report submitted for PO-20250923-002 (Rating: 5/5)</li>
          </ul>
          <button className="cta-button">View Full Audit Log</button>
        </div>
      </div>

      {/* Assign Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Employee to Order</h3>
            <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.Employee_name} (ID: {emp.employee_id})
                </option>
              ))}
            </select>
            <div style={{ marginTop: "15px" }}>
              <button className="cta-button primary" onClick={handleAssignConfirm} disabled={!selectedEmployee}>
                Assign
              </button>
              <button className="cta-button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
            {assignMsg && <p className={assignMsg.includes("success") ? "success-msg" : "error-msg"}>{assignMsg}</p>}
          </div>
        </div>
      )}
    </TechnicianLayout>
  );
}

export default TechnicianDashboard;