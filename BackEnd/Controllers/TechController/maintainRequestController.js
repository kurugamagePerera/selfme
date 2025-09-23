// Backend: Controllers/TechController/maintainRequestController.js
const MaintainRequest = require("../../Model/TechModel/maintainRequestModel");
const Employee = require("../../Model/TechModel/employeeModel");

exports.createMaintainRequest = async (req, res) => {
  try {
    const { description } = req.body;
    if (/[!#$%]/.test(description)) {
      return res.status(400).json({ error: "Description cannot contain special characters !#$%" });
    }
    const request = await MaintainRequest.create(req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllMaintainRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-request_date", search, filterStatus, filterPriority } = req.query;
    const query = {};
    if (search) query.description = { $regex: search, $options: "i" };
    if (filterStatus) query.status = filterStatus;
    if (filterPriority) query.priority = filterPriority;
    const requests = await MaintainRequest.find(query)
      .populate("assigned_employee")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await MaintainRequest.countDocuments(query);
    res.json({ requests, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.assignMaintainRequest = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const request = await MaintainRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });
    request.assigned_employee = employeeId;
    request.assigned_date = new Date();
    request.deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await request.save();
    await Employee.findByIdAndUpdate(employeeId, { $addToSet: { assigned_maintenances: request._id } });
    res.json({ message: "Assigned successfully", request });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateMaintainStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await MaintainRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(request);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteMaintainRequest = async (req, res) => {
  try {
    const request = await MaintainRequest.findByIdAndDelete(req.params.id);
    if (request.assigned_employee) {
      await Employee.findByIdAndUpdate(request.assigned_employee, { $pull: { assigned_maintenances: request._id } });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};