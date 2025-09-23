// Backend: Model/TechModel/jobReportModel.js
const mongoose = require("mongoose");

const jobReportSchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ref to PurchaseOrder or MaintainRequest
    job_type: { type: String, enum: ["PurchaseOrder", "MaintainRequest"], required: true },
    technician_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    report_details: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String },
    submitted_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Post-save: Update employee performance
jobReportSchema.post("save", async function () {
  const reports = await this.model("JobReport").find({ technician_id: this.technician_id });
  const avgRating = reports.length ? reports.reduce((sum, r) => sum + r.rating, 0) / reports.length : 0;
  await mongoose.model("Employee").findByIdAndUpdate(this.technician_id, { performance_rating: avgRating });
});

module.exports = mongoose.model("JobReport", jobReportSchema);