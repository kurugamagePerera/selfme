const express = require("express");
const router = express.Router();
const { getSuccessPaidOrders } = require("../Controllers/orderReviewerController");

router.get("/success-paid", getSuccessPaidOrders);

module.exports = router;