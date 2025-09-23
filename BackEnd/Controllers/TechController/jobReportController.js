// Backend: Controllers/TechController/jobReportController.js
const JobReport = require("../../Model/TechModel/jobReportModel");

exports.submitJobReport = async (req, res) => {
  try {
    const { report_details } = req.body;
    if (/[!#$%]/.test(report_details)) {
      return res.status(400).json({ error: "Details cannot contain special characters !#$%" });
    }
    const report = await JobReport.create(req.body);
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getJobReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-submitted_at", filterTechnician } = req.query;
    const query = {};
    if (filterTechnician) query.technician_id = filterTechnician;
    const reports = await JobReport.find(query)
      .populate("technician_id")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await JobReport.countDocuments(query);
    res.json({ reports, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};