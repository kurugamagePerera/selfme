// Backend: Routes/TechRoute/jobReportRoutes.js
const express = require("express");
const router = express.Router();
const jobReportController = require("../../Controllers/TechController/jobReportController");

router.post("/", jobReportController.submitJobReport);
router.get("/", jobReportController.getJobReports);

module.exports = router;