/*const PurchaseOrder = require('../Model/purchaseOrderModel');

exports.getSuccessPaidOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find({ status: 'success', paid: true })
      .select('po_id order_date total_amount status paid created_at')
      .sort({ created_at: -1 });

    const formattedOrders = orders.map(order => ({
      po_id: order.po_id,
      order_date: order.order_date,
      total_amount: order.total_amount,
      status: order.status,
      paid: order.paid,
      created_at: order.created_at
    }));

    res.json({ success: true, data: formattedOrders, count: formattedOrders.length });
  } catch (error) {
    console.error('Read error:', error);
    res.status(500).json({ success: false, message: 'Server error during read' });
  }
};
*/


/*const PurchaseOrder = require('../Model/purchaseOrderModel');

exports.getSuccessPaidOrders = async (req, res) => {
  try {
    // Updated query to handle string/boolean matching explicitly
    const orders = await PurchaseOrder.find({
      status: { $eq: 'success' }, // Explicit string match for status
      paid: true // Boolean match for paid
    })
      .select('po_id order_date total_amount status paid created_at')
      .sort({ created_at: -1 });

    // Format for frontend (po_id is PK)
    const formattedOrders = orders.map(order => ({
      po_id: order.po_id,
      order_date: order.order_date,
      total_amount: order.total_amount,
      status: order.status,
      paid: order.paid,
      created_at: order.created_at
    }));

    res.json({ success: true, data: formattedOrders, count: formattedOrders.length });
  } catch (error) {
    console.error('Read error:', error);
    res.status(500).json({ success: false, message: 'Server error during read' });
  }
};
*/


const PurchaseOrder = require('../Model/purchaseOrderModel');

exports.getSuccessPaidOrders = async (req, res) => {
  try {
    const orders = await PurchaseOrder.find({
      status: { $eq: 'success' },
      paid: true
    })
      .populate('assigned_technicians', 'employee_name')
      .select('po_id order_date total_amount status paid created_at assigned_technicians')
      .sort({ created_at: -1 });

    const formattedOrders = orders.map(order => ({
      po_id: order.po_id,
      order_date: order.order_date,
      total_amount: order.total_amount,
      status: order.status,
      paid: order.paid,
      created_at: order.created_at,
      assigned_technicians: order.assigned_technicians.map(t => t.employee_name || t._id)
    }));

    res.json({ success: true, data: formattedOrders, count: formattedOrders.length });
  } catch (error) {
    console.error('Read error:', error);
    res.status(500).json({ success: false, message: 'Server error during read' });
  }
};


