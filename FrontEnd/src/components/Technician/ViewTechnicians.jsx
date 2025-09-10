/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);

  // Fetch all technicians on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/technicians")
      .then((res) => setTechnicians(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Delete a technician by MongoDB _id
  const deleteTechnician = async (id) => {
    if (!window.confirm("Are you sure you want to delete this technician?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/technicians/${id}`);
      setTechnicians(technicians.filter((tech) => tech._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Technician List</h2>
      <Link to="/addTechnician">
        <button>Add New Technician</button>
      </Link>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>DOB</th>
            <th>Contact</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((tech) => (
            <tr key={tech._id}>
              <td>{tech.technician_id}</td>
              <td>{tech.technician_name}</td>
              <td>{tech.technician_address}</td>
              <td>{new Date(tech.technician_dob).toLocaleDateString()}</td>
              <td>{tech.contact_number}</td>
              <td>{new Date(tech.hire_date).toLocaleDateString()}</td>
              <td>
                <Link to={`/updateTechnician/${tech._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteTechnician(tech._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTechnicians;
*/


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ViewTechnicians = () => {
  const [employees, setEmployees] = useState([]);

  // Fetch all employees on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/api/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Delete an employee by MongoDB _id
  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      setEmployees(employees.filter((emp) => emp._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Employee List</h2>
      <Link to="/addTechnician">
        <button>Add New Employee</button>
      </Link>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>DOB</th>
            <th>Contact</th>
            <th>Hire Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>{emp.employee_id}</td>
              <td>{emp.employee_name}</td>
              <td>{emp.employee_address}</td>
              <td>{new Date(emp.employee_dob).toLocaleDateString()}</td>
              <td>{emp.contact_number}</td>
              <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
              <td>
                <Link to={`/updateTechnician/${emp._id}`}>
                  <button>Edit</button>
                </Link>
                <button onClick={() => deleteEmployee(emp._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewTechnicians;