/*const mongoose = require("mongoose");

// Define the technician schema
const technicianSchema = new mongoose.Schema({
  technician_id: {
    type: Number,
    unique: true,
    required: true,
  },
  technician_name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  technician_address: {
    type: String,
    required: true,
    maxlength: 255,
  },
  technician_dob: {
    type: Date,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
    maxlength: 20,
  },
  hire_date: {
    type: Date,
    default: Date.now,
  },
});

// Pre-validate hook to auto-increment technician_id before validation
technicianSchema.pre("validate", async function (next) {
  if (!this.isNew) return next();

  try {
    const lastTech = await this.constructor.findOne({}, {}, { sort: { technician_id: -1 } });
    this.technician_id = lastTech ? lastTech.technician_id + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

// Export the Technician model (changed from "Employee" to match context)
module.exports = mongoose.model("Testnew", technicianSchema);

*/

const mongoose = require("mongoose");

// Define the employee schema
const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: Number,
    unique: true,
    required: true,
  },
  employee_name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  employee_address: {
    type: String,
    required: true,
    maxlength: 255,
  },
  employee_dob: {
    type: Date,
    required: true,
  },
  contact_number: {
    type: String,
    required: true,
    maxlength: 20,
  },
  hire_date: {
    type: Date,
    default: Date.now,
  },
});

// Pre-validate hook to auto-increment employee_id before validation
employeeSchema.pre("validate", async function (next) {
  if (!this.isNew) return next();

  try {
    const lastEmp = await this.constructor.findOne({}, {}, { sort: { employee_id: -1 } });
    this.employee_id = lastEmp ? lastEmp.employee_id + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

// Export the Employee model
module.exports = mongoose.model("AssignEmp", employeeSchema);