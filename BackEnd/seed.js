/*const mongoose = require('mongoose');
const PurchaseOrder = require('./Model/purchaseOrderModel');
require('dotenv').config();

const sampleOrders = [
  { order_date: new Date('2025-09-01'), total_amount: 1500.75, status: 'success', paid: true },
  { order_date: new Date('2025-09-05'), total_amount: 2500.00, status: 'success', paid: true },
  { order_date: new Date('2025-09-07'), total_amount: 875.50, status: 'success', paid: true },
  { order_date: new Date('2025-09-08'), total_amount: 3200.25, status: 'processing', paid: false },
  { order_date: new Date('2025-09-09'), total_amount: 1800.00, status: 'success', paid: true }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Seeding MongoDB with mock data');
    await PurchaseOrder.deleteMany({});
    await PurchaseOrder.insertMany(sampleOrders);
    console.log('Seeded 5 purchase orders');
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
  */

  const mongoose = require('mongoose');
const PurchaseOrder = require('./Model/purchaseOrderModel');
require('dotenv').config();

const testOrders = [
  // Successful and Paid Orders
  { order_date: new Date('2025-09-01'), total_amount: 1500.75, status: 'success', paid: true },
  { order_date: new Date('2025-09-05'), total_amount: 2500.00, status: 'success', paid: true },
  { order_date: new Date('2025-09-07'), total_amount: 875.50, status: 'success', paid: true },
  { order_date: new Date('2025-09-09'), total_amount: 1800.00, status: 'success', paid: true },

  // Non-Successful or Non-Paid Orders (Should Not Appear)
  { order_date: new Date('2025-09-02'), total_amount: 1200.30, status: 'processing', paid: false },
  { order_date: new Date('2025-09-03'), total_amount: 3000.00, status: 'failed', paid: false },
  { order_date: new Date('2025-09-04'), total_amount: 900.25, status: 'success', paid: false },
  { order_date: new Date('2025-09-06'), total_amount: 2000.50, status: 'processing', paid: true }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Seeding MongoDB with test data');
    await PurchaseOrder.deleteMany({}); // Clear existing data
    await PurchaseOrder.insertMany(testOrders); // Insert test data
    console.log(`Seeded ${testOrders.length} purchase orders`);
    mongoose.disconnect();
    process.exit(0);
  })
  .catch(err => {
    console.error('Seeding error:', err);
    process.exit(1);
  });