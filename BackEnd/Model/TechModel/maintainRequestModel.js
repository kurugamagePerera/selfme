// Backend: Model/TechModel/maintainRequestModel.js
const mongoose = require("mongoose");
const JobHistory = require("./jobHistoryModel");

const maintainRequestSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assume User model
    request_type: { type: String, enum: ["Repair", "Inspection", "Upgrade"], required: true },
    request_date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Pending", "In Progress", "Completed", "Cancelled"], default: "Pending" },
    assigned_employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    assigned_date: { type: Date, default: null },
    deadline: { type: Date },
    description: { type: String, required: true },
    location: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  },
  { timestamps: true }
);

// Middleware for history
maintainRequestSchema.pre("save", async function (next) {
  if (this.isModified("status")) {
    await JobHistory.create({
      job_id: this._id,
      job_type: "MaintainRequest",
      status: this.status,
      notes: `Status changed to ${this.status}`,
    });
  }
  next();
});

module.exports = mongoose.model("MaintainRequest", maintainRequestSchema);