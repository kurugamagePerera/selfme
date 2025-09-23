// BackEnd/Controllers/TechController/purchaseOrderController.js
// Updated path to correctly reference purchaseOrderModel
const PurchaseOrder = require("../../Model/TechModel/purchaseOrderModel");

exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', filterStatus = '' } = req.query;
    const query = { paid: true };
    if (search) {
      query.$or = [
        { custom_id: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { product: { $regex: search, $options: 'i' } },
      ];
    }
    if (filterStatus) query.status = filterStatus;
    
    const orders = await PurchaseOrder.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .populate('assigned_employee', 'Employee_name employee_id');
    const count = await PurchaseOrder.countDocuments(query);
    
    res.json({
      orders,
      totalPages: Math.ceil(count / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};