// Backend: Controllers/TechController/assignmentController.js
const PurchaseOrder = require("../../Model/TechModel/purchaseOrderModel");
const Employee = require("../../Model/TechModel/employeeModel");

exports.assignTask = async (req, res) => {
  try {
    const { employeeId, order } = req.body;
    const now = new Date();
    const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (new Date(order.orderDate) > now) {
      return res.status(400).json({ error: "Order date cannot be future" });
    }
    let dbOrder = await PurchaseOrder.findOne({ custom_id: order.id });

    if (!dbOrder) {
      dbOrder = await PurchaseOrder.create({
        custom_id: order.id,
        customerId: order.customerId,
        order_date: order.orderDate,
        total_amount: Number(order.amount.replace(/[^\d.]/g, "")),
        status: "Pending",
        paid: true,
        created_at: now,
        assigned_employee: employeeId,
        assigned_date: now,
        deadline: deadline,
        customerName: order.customerName,
        product: order.product,
      });
    } else {
      dbOrder.assigned_employee = employeeId;
      dbOrder.assigned_date = now;
      dbOrder.deadline = deadline;
      dbOrder.customerName = order.customerName;
      dbOrder.product = order.product;
      await dbOrder.save();
    }

    await Employee.findByIdAndUpdate(employeeId, {
      $addToSet: { assigned_tasks: dbOrder._id },
    });

    res.json({ message: "Task assigned successfully", order: dbOrder });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await PurchaseOrder.find({ assigned_employee: { $ne: null } })
      .populate("assigned_employee")
      .sort({ assigned_date: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markTaskDone = async (req, res) => {
  try {
    const task = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      { status: "Done" },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await PurchaseOrder.findByIdAndDelete(req.params.id);
    if (task && task.assigned_employee) {
      await Employee.findByIdAndUpdate(task.assigned_employee, {
        $pull: { assigned_tasks: task._id },
      });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAssignedEmployee = async (req, res) => {
  try {
    const { newEmployeeId } = req.body;
    const task = await PurchaseOrder.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    if (task.assigned_employee) {
      await Employee.findByIdAndUpdate(task.assigned_employee, {
        $pull: { assigned_tasks: task._id },
      });
    }
    await Employee.findByIdAndUpdate(newEmployeeId, {
      $addToSet: { assigned_tasks: task._id },
    });

    task.assigned_employee = newEmployeeId;
    await task.save();

    res.json({ message: "Employee updated successfully", task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUnassignedOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-created_at", search } = req.query;
    const query = { assigned_employee: null, paid: true };
    if (search) {
      query.$or = [
        { custom_id: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { product: { $regex: search, $options: "i" } },
      ];
    }
    const orders = await PurchaseOrder.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await PurchaseOrder.countDocuments(query);
    res.json({ orders, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTechStats = async (req, res) => {
  try {
    const pendingTasks = await PurchaseOrder.countDocuments({ status: "Pending", assigned_employee: { $ne: null } });
    const completedTasks = await PurchaseOrder.countDocuments({ status: "Done" });
    const unassigned = await PurchaseOrder.countDocuments({ assigned_employee: null, paid: true });
    const overdue = await PurchaseOrder.countDocuments({ deadline: { $lt: new Date() }, status: { $ne: "Done" } });
    const avgRating = await Employee.aggregate([{ $group: { _id: null, avg: { $avg: "$performance_rating" } } }]);
    res.json({ pendingTasks, completedTasks, unassigned, overdue, avgRating: avgRating[0]?.avg || 0 });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};