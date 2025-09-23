// Backend: Model/TechModel/jobHistoryModel.js
const mongoose = require("mongoose");

const jobHistorySchema = new mongoose.Schema(
  {
    job_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ref to PurchaseOrder or MaintainRequest
    job_type: { type: String, enum: ["PurchaseOrder", "MaintainRequest"], required: true },
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobHistory", jobHistorySchema);