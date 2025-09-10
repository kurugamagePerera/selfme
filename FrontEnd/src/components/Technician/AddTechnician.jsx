/*import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTechnician = () => {
  const [formData, setFormData] = useState({
    technician_name: "",
    technician_address: "",
    technician_dob: "",
    contact_number: "",
    hire_date: "",
  });

  const navigate = useNavigate();

  // Update form data on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to add technician
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data to send: remove empty optional fields
      const dataToSend = { ...formData };
      if (!dataToSend.hire_date) delete dataToSend.hire_date;

      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:5000/api/technicians",
        dataToSend
      );

      alert("Technician Added Successfully!");
      navigate("/viewTechnicians"); // Navigate to view page
    } catch (error) {
      console.error("Error adding technician:", error.response?.data || error.message);

      // Handle validation errors from backend
      const message =
        error.response?.data?.message ||
        (error.response?.data?.errors
          ? error.response.data.errors.join(", ")
          : error.message);

      alert("Error adding technician: " + message);
    }
  };

  return (
    <div className="container">
      <h2>Add Technician</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="technician_name"
          placeholder="Full Name"
          value={formData.technician_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="technician_address"
          placeholder="Address"
          value={formData.technician_address}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="technician_dob"
          value={formData.technician_dob}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="hire_date"
          value={formData.hire_date}
          onChange={handleChange}
        />
        <button type="submit">Add Technician</button>
      </form>
    </div>
  );
};

export default AddTechnician;
*/

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTechnician = () => {
  const [formData, setFormData] = useState({
    employee_name: "",
    employee_address: "",
    employee_dob: "",
    contact_number: "",
    hire_date: "",
  });

  const navigate = useNavigate();

  // Update form data on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to add employee
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data to send: remove empty optional fields
      const dataToSend = { ...formData };
      if (!dataToSend.hire_date) delete dataToSend.hire_date;

      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:5000/api/employees",
        dataToSend
      );

      alert("Employee Added Successfully!");
      navigate("/viewTechnicians"); // Navigate to view page
    } catch (error) {
      console.error("Error adding employee:", error.response?.data || error.message);

      // Handle validation errors from backend
      const message =
        error.response?.data?.message ||
        (error.response?.data?.errors
          ? error.response.data.errors.join(", ")
          : error.message);

      alert("Error adding employee: " + message);
    }
  };

  return (
    <div className="container">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="employee_name"
          placeholder="Full Name"
          value={formData.employee_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="employee_address"
          placeholder="Address"
          value={formData.employee_address}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="employee_dob"
          value={formData.employee_dob}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="hire_date"
          value={formData.hire_date}
          onChange={handleChange}
        />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddTechnician;