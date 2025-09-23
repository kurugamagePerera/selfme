// src/components/TechnicianDashboard/JobReports.jsx
import React, { useEffect, useState } from "react";
import TechnicianLayout from "./TechnicianLayout";
import ReactPaginate from "react-paginate";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./TechnicianDashboard.css";

function JobReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterTechnician, setFilterTechnician] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [employees, setEmployees] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({ job_id: "", job_type: "PurchaseOrder", technician_id: "", report_details: "", rating: 5, comments: "" });
  const [mockReports] = useState([
    { _id: 'mock1', job_id: 'PO-MOCK1', job_type: 'PurchaseOrder', technician_id: { _id: 'mockEmp1', Employee_name: 'John Doe' }, report_details: 'Mock installation complete', rating: 5, comments: 'Good job', submitted_at: new Date() },
    { _id: 'mock2', job_id: 'MR-MOCK1', job_type: 'MaintainRequest', technician_id: { _id: 'mockEmp2', Employee_name: 'Jane Smith' }, report_details: 'Mock repair done', rating: 4, comments: 'Minor issue', submitted_at: new Date() },
  ]); // Fallback

  useEffect(() => {
    fetchReports();
    fetch("http://localhost:5000/employees").then(res => res.json()).then(setEmployees).catch(() => setEmployees([]));
  }, [search, filterTechnician, filterRating, currentPage]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/jobreports?page=${currentPage + 1}&limit=10&search=${search}&filterTechnician=${filterTechnician}&filterRating=${filterRating}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setReports(data.reports || []);
      setPageCount(data.totalPages || 0);
      if (data.reports.length === 0) setError("No job reports found. Submit some via Completed Tasks.");
    } catch (err) {
      console.error(err);
      setError("Failed to load reports. Using mock data.");
      setReports(mockReports);
    }
    setLoading(false);
  };

  const handleSubmitReport = async () => {
    if (!submitForm.report_details || !submitForm.job_id) return alert("Details and job ID required");
    try {
      await fetch("http://localhost:5000/jobreports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitForm),
      });
      setShowSubmitModal(false);
      setSubmitForm({ job_id: "", job_type: "PurchaseOrder", technician_id: "", report_details: "", rating: 5, comments: "" });
      fetchReports();
      alert("Report submitted!");
    } catch (err) {
      alert("Submission failed");
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    let newValue = value.replace(/[!#$%]/g, ""); // No special chars
    setSubmitForm({ ...submitForm, [name]: newValue });
  };

  const handleExportCSV = () => {
    const csv = reports.map(report => 
      `${report.job_type},${report.technician_id?.Employee_name},${report.report_details},${report.rating},${report.comments}`
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-reports.csv';
    a.click();
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const chartData = {
    labels: ['1-2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [
      {
        label: 'Ratings Distribution',
        data: [
          reports.filter(r => r.rating <= 2).length,
          reports.filter(r => r.rating === 3).length,
          reports.filter(r => r.rating === 4).length,
          reports.filter(r => r.rating === 5).length,
        ],
        backgroundColor: ['#dc3545', '#ffc107', '#007bff', '#28a745'],
      },
    ],
  };

  if (loading) return <div className="loading">Loading job reports...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <TechnicianLayout>
      <h2>Job Reports ({reports.length})</h2>
      <p>View and submit job reports with filters, charts, and export options for performance tracking.</p>

      {/* Advanced Filters */}
      <div className="search-filter-container">
        <input type="text" placeholder="Search by details or comments" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
        <select value={filterTechnician} onChange={(e) => setFilterTechnician(e.target.value)} className="filter-select">
          <option value="">All Technicians</option>
          {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.Employee_name}</option>)}
        </select>
        <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="filter-select">
          <option value="">All Ratings</option>
          <option value="1-3">1-3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        <button className="cta-button primary" onClick={handleExportCSV}>Export CSV</button>
        <button className="cta-button primary" onClick={() => setShowSubmitModal(true)}>Submit New Report</button>
      </div>

      {reports.length === 0 ? (
        <div className="empty-state">
          <h3>No job reports</h3>
          <p>Submit reports for completed tasks to see them here.</p>
          <button className="cta-button primary" onClick={() => setShowSubmitModal(true)}>Submit Report</button>
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Type</th>
              <th>Technician</th>
              <th>Details</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id}>
                <td>{report.job_id}</td>
                <td>{report.job_type}</td>
                <td>{report.technician_id?.Employee_name || "-"}</td>
                <td>{report.report_details}</td>
                <td style={{ color: report.rating >= 4 ? "green" : report.rating === 3 ? "orange" : "red" }}>{report.rating}/5</td>
                <td>{report.comments || "-"}</td>
                <td>{new Date(report.submitted_at).toLocaleString()}</td>
                <td>
                  <button className="cta-button">View Details</button>
                  <button className="cta-button" style={{ background: "#dc3545" }}>Delete</button>
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
          <option>Bulk Export</option>
          <option>Bulk Delete</option>
        </select>
        <button className="cta-button primary">Apply to Selected</button>
      </div>

      {/* Ratings Chart */}
      <div className="chart-container">
        <h2>Ratings Distribution</h2>
        <Bar data={chartData} />
        <p>Average rating: {reports.reduce((sum, r) => sum + r.rating, 0) / reports.length || 0}.toFixed(1)/5</p>
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Submit Job Report</h3>
            <input placeholder="Job ID" value={submitForm.job_id} onChange={handleInput} name="job_id" />
            <select value={submitForm.job_type} onChange={handleInput} name="job_type">
              <option value="PurchaseOrder">Purchase Order</option>
              <option value="MaintainRequest">Maintenance Request</option>
            </select>
            <select value={submitForm.technician_id} onChange={handleInput} name="technician_id">
              <option value="">Select Technician</option>
              {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.Employee_name}</option>)}
            </select>
            <textarea placeholder="Report details" value={submitForm.report_details} onChange={handleInput} name="report_details" />
            <select value={submitForm.rating} onChange={handleInput} name="rating">
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}/5</option>)}
            </select>
            <textarea placeholder="Comments" value={submitForm.comments} onChange={handleInput} name="comments" />
            <button className="cta-button primary" onClick={handleSubmitReport}>Submit</button>
            <button className="cta-button" onClick={() => setShowSubmitModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </TechnicianLayout>
  );
}

export default JobReports;