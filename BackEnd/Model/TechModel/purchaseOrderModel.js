// Backend: Model/TechModel/purchaseOrderModel.js
const mongoose = require("mongoose");
const JobHistory = require("./jobHistoryModel"); // New model

const purchaseOrderSchema = new mongoose.Schema(
  {
    custom_id: { type: String, unique: true }, // Make specific, e.g., PO-20250923-001
    customerId: { type: String },
    order_date: { type: Date, required: true },
    total_amount: { type: Number, required: true, min: 0, max: 10000000 }, // Restrict high amounts
    status: { type: String, required: true },
    paid: { type: Boolean, required: true },
    created_at: { type: Date, default: Date.now },
    assigned_employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    assigned_date: { type: Date, default: null },
    deadline: { type: Date, default: null },
    customerName: { type: String },
    product: { type: String },
    notes: { type: String }, // Added for more details
  },
  { timestamps: true }
);

// Middleware to log history on status change
purchaseOrderSchema.pre("save", async function (next) {
  if (this.isModified("status")) {
    await JobHistory.create({
      job_id: this._id,
      job_type: "PurchaseOrder",
      status: this.status,
      notes: `Status changed to ${this.status}`,
    });
  }
  if (!this.custom_id) {
    // Generate specific ID
    const count = await this.model("PurchaseOrder").countDocuments();
    this.custom_id = `PO-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model("PurchaseOrder", purchaseOrderSchema);