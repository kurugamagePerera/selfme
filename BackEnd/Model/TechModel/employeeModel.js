// Backend: Model/TechModel/employeeModel.js
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const employeeSchema = new mongoose.Schema(
  {
    employee_id: { type: Number, unique: true }, // Auto-incremented field
    Employee_name: { type: String, required: true },
    Employee_Address: { type: String, required: true },
    Employee_Dob: { type: Date, required: true },
    contact_number: { type: String, required: true },
    hire_date: { type: Date, required: true },
    email: { type: String }, // Added
    assigned_tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PurchaseOrder",
      },
    ],
    assigned_maintenances: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaintainRequest",
      },
    ],
    performance_rating: { type: Number, default: 0 }, // Average from job reports
  },
  { timestamps: true }
);

employeeSchema.plugin(AutoIncrement, { inc_field: "employee_id" });

module.exports = mongoose.model("Employee", employeeSchema);