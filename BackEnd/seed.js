// BackEnd/seed.js
const mongoose = require('mongoose');
const PurchaseOrder = require('./Model/TechModel/purchaseOrderModel');
const Employee = require('./Model/TechModel/employeeModel');
const MaintainRequest = require('./Model/TechModel/maintainRequestModel');
const JobReport = require('./Model/TechModel/jobReportModel');

mongoose.connect('mongodb+srv://adminSelfme:P40YIFy04Am8rnDe@cluster0.4bp3tta.mongodb.net/inventoryDBs')
  .then(async () => {
    console.log('Seeding data...');

    // Clear existing data
    await PurchaseOrder.deleteMany({});
    await Employee.deleteMany({});
    await MaintainRequest.deleteMany({});
    await JobReport.deleteMany({});

    // Seed Employees
    const employees = await Employee.insertMany([
      { Employee_name: 'John Doe', Employee_Address: '123 Main St', Employee_Dob: new Date('1990-01-01'), contact_number: '1234567890', hire_date: new Date('2020-01-01'), email: 'john@example.com' },
      { Employee_name: 'Jane Smith', Employee_Address: '456 Oak Ave', Employee_Dob: new Date('1992-05-15'), contact_number: '0987654321', hire_date: new Date('2021-03-10'), email: 'jane@example.com' },
    ]);

    // Seed PurchaseOrders (mix of unassigned, pending, completed)
    await PurchaseOrder.insertMany([
      { custom_id: 'PO-20250923-001', customerId: 'CUST001', customerName: 'Acme Corp', product: 'Solar Panel Kit', total_amount: 250000, status: 'Pending', paid: true, order_date: new Date('2025-09-01'), assigned_employee: employees[0]._id, assigned_date: new Date(), deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      { custom_id: 'PO-20250923-002', customerId: 'CUST002', customerName: 'Beta Inc', product: 'Battery Pack', total_amount: 150000, status: 'Done', paid: true, order_date: new Date('2025-09-02'), assigned_employee: employees[1]._id, assigned_date: new Date(), deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { custom_id: 'PO-20250923-003', customerId: 'CUST003', customerName: 'Gamma Ltd', product: 'Inverter', total_amount: 100000, status: 'Pending', paid: true, order_date: new Date('2025-09-03'), assigned_employee: null }, // Unassigned
      { custom_id: 'PO-20250923-004', customerId: 'CUST004', customerName: 'Delta Co', product: 'Full System', total_amount: 500000, status: 'Done', paid: true, order_date: new Date('2025-09-04'), assigned_employee: employees[0]._id },
      { custom_id: 'PO-20250923-005', customerId: 'CUST005', customerName: 'Epsilon Firm', product: 'Solar Kit', total_amount: 250000, status: 'Pending', paid: false, order_date: new Date('2025-09-05'), assigned_employee: employees[1]._id }, // Overdue simulation
    ]);

    // Seed MaintainRequests
    await MaintainRequest.insertMany([
      { request_type: 'Repair', description: 'Fix solar panel', status: 'Pending', priority: 'High', location: 'Colombo', assigned_employee: employees[0]._id, deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
      { request_type: 'Inspection', description: 'Annual check', status: 'Completed', priority: 'Medium', location: 'Kandy', assigned_employee: employees[1]._id },
      { request_type: 'Upgrade', description: 'Add battery', status: 'In Progress', priority: 'Low', location: 'Galle', assigned_employee: null },
    ]);

    // Seed JobReports
    await JobReport.insertMany([
      { job_id: 'PO-20250923-002', job_type: 'PurchaseOrder', technician_id: employees[1]._id, report_details: 'Installation completed successfully', rating: 5, comments: 'Client satisfied' },
      { job_id: 'PO-20250923-004', job_type: 'PurchaseOrder', technician_id: employees[0]._id, report_details: 'System upgraded', rating: 4, comments: 'Minor delay' },
    ]);

    console.log('Data seeded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  });