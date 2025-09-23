// BackEnd/Routes/purchaseOrderRoutes.js
const express = require('express');
const router = express.Router();
// Updated path to correctly reference purchaseOrderController
const purchaseOrderController = require('../../Controllers/TechController/purchaseOrderController');

router.get("/", purchaseOrderController.getAllPurchaseOrders);

module.exports = router;