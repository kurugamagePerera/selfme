import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TechnicianDashboard.css";
import TechnicianLayout from "./TechnicianLayout";

function TechnicianDashboard() {
  const navigate = useNavigate();

  // Hardcoded fake Sri Lankan purchase order data
  const orders = [
    {
      id: "PO-001",
      customerId: "CUST-001", // <-- Add this
      customerName: "Amal Perera",
      product: "5KW Home Solar System",
      quantity: 1,
      amount: "Rs. 250,000",
      paymentStatus: "Success",
      orderDate: "2025-09-01",
      location: "Colombo",
    },
    {
      id: "PO-002",
      customerId: "CUST-002",
      customerName: "Nimali Fernando",
      product: "Lithium-ion Battery Pack",
      quantity: 2,
      amount: "Rs. 150,000",
      paymentStatus: "Success",
      orderDate: "2025-09-02",
      location: "Kandy",
    },
    {
      id: "PO-003",
      customerId: "CUST-003",
      customerName: "Saman Jayasinghe",
      product: "Hybrid Inverter",
      quantity: 1,
      amount: "Rs. 100,000",
      paymentStatus: "Success",
      orderDate: "2025-09-03",
      location: "Galle",
    },
    {
      id: "PO-004",
      customerId: "CUST-004",
      customerName: "Kumari Silva",
      product: "20KW Business Package",
      quantity: 1,
      amount: "Rs. 500,000",
      paymentStatus: "Success",
      orderDate: "2025-09-04",
      location: "Jaffna",
    },
    {
      id: "PO-005",
      customerId: "CUST-005",
      customerName: "Ranil Wickramasinghe",
      product: "5KW Home Solar System",
      quantity: 1,
      amount: "Rs. 250,000",
      paymentStatus: "Success",
      orderDate: "2025-09-05",
      location: "Negombo",
    },
  ];

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [assignMsg, setAssignMsg] = useState("");

  // Fetch employees when modal opens
  useEffect(() => {
    if (showModal) {
      fetch("http://localhost:5000/employees")
        .then((res) => res.json())
        .then((data) => setEmployees(data));
    }
  }, [showModal]);

  // Open modal and set order id
  const handleAssignEmployee = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
    setSelectedEmployee("");
    setAssignMsg("");
  };

  // Assign employee to order
  const handleAssignConfirm = async () => {
    if (!selectedEmployee) return;
    const orderObj = orders.find((o) => o.id === selectedOrderId);
    const res = await fetch("http://localhost:5000/assignments/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: selectedEmployee,
        order: orderObj, // send the whole order object
      }),
    });
    if (res.ok) {
      setAssignMsg("Assigned successfully!");
      setTimeout(() => setShowModal(false), 1000);
    } else {
      setAssignMsg("Assignment failed!");
    }
  };

  return (
    <TechnicianLayout>
      <div className="technician-dashboard">
        <h1>Technician Dashboard</h1>
        <p>Select an option above to manage tasks or employees.</p>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Order Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customerId}</td>
                <td>{order.customerName}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>{order.amount}</td>
                <td className="status-success">{order.paymentStatus}</td>
                <td>{order.orderDate}</td>
                <td>{order.location}</td>
                <td>
                  <button
                    className="cta-button primary"
                    onClick={() => handleAssignEmployee(order.id)}
                  >
                    Assign Employee
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal for assigning employee */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Assign Employee</h3>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.Employee_name}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: "15px" }}>
                <button
                  className="cta-button primary"
                  onClick={handleAssignConfirm}
                  disabled={!selectedEmployee}
                >
                  Assign
                </button>
                <button
                  className="cta-button"
                  style={{ marginLeft: "10px" }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
              {assignMsg && <div className="success-msg">{assignMsg}</div>}
            </div>
          </div>
        )}
      </div>
    </TechnicianLayout>
  );
}

export default TechnicianDashboard;