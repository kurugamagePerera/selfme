// src/components/TechnicianDashboard/TechnicianLayout.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TechnicianDashboard.css";

function TechnicianLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      <div className="technician-dashboard">
        <div className="dashboard-btn-group">
          <button className={`cta-button primary${isActive("/technicianDashboard") ? " active-btn" : ""}`} onClick={() => navigate("/technicianDashboard")}>
            Dashboard
          </button>
          <button className={`cta-button primary${isActive("/technicianDashboard/register-employee") ? " active-btn" : ""}`} onClick={() => navigate("/technicianDashboard/register-employee")}>
            Register Employee
          </button>
          <button className={`cta-button primary${isActive("/technicianDashboard/employees") ? " active-btn" : ""}`} onClick={() => navigate("/technicianDashboard/employees")}>
            Employees
          </button>
          <button className={`cta-button primary${isActive("/technicianDashboard/assigned-tasks") ? " active-btn" : ""}`} onClick={() => navigate("/technicianDashboard/assigned-tasks")}>
            Pending Tasks
          </button>
          <button className={`cta-button primary${isActive("/technicianDashboard/completed-tasks") ? " active-btn" : ""}`} onClick={() => navigate("/technicianDashboard/completed-tasks")}>
            Completed Tasks
          </button>
          <button className={`cta-button primary${isActive("/technicianDashboard/maintenance-requests") ? " active-btn" : ""}`} onClick={() => navigate("/technicianDashboard/maintenance-requests")}>
            Maintenance Requests
          </button>
          <button className={`cta-button primary${isActive("/technicianDashboard/job-reports") ? " active-btn" : ""}`} onClick={() => navigate("/technicianDashboard/job-reports")}>
            Job Reports
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default TechnicianLayout;