import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateTechnician = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    technician_name: "",
    technician_address: "",
    technician_dob: "",
    contact_number: "",
    hire_date: "",
  });

  // Fetch technician data on component mount
  useEffect(() => {
    axios.get(`http://localhost:5000/api/technicians/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  // Update form data on input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form to update technician
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/technicians/${id}`, formData);
      alert("Technician Updated Successfully!");
      navigate("/viewTechnicians"); // Consistent navigation to view page
    } catch (error) {
      console.error(error);
      alert("Error updating technician");
    }
  };

  return (
    <div className="container">
      <h2>Update Technician</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="technician_name"
          value={formData.technician_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="technician_address"
          value={formData.technician_address}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="technician_dob"
          value={formData.technician_dob?.split("T")[0] || ""}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_number"
          value={formData.contact_number}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="hire_date"
          value={formData.hire_date?.split("T")[0] || ""}
          onChange={handleChange}
        />
        <button type="submit">Update Technician</button>
      </form>
    </div>
  );
};

export default UpdateTechnician;