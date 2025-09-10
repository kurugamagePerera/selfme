const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  po_id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Primary Key
  order_date: { type: Date, required: true },
  total_amount: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['processing', 'success', 'failed'], required: true },
  paid: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('POrderT', purchaseOrderSchema);

