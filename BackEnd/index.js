// Backend: index.js
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const itemRoutes = require("./Routes/ItemRoutes");
const employeeRoutes = require("./Routes/TechRoute/employeeRoutes");
const assignmentRoutes = require("./Routes/TechRoute/assignmentRoutes");
const maintainRoutes = require("./Routes/TechRoute/maintainRoutes"); // New
const jobReportRoutes = require("./Routes/TechRoute/jobReportRoutes"); // New
const cors = require("cors");
const path = require("path");

//Middleware
app.use(cors());
app.use(express.json());
app.use("/items", itemRoutes);
app.use("/employees", employeeRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/maintenances", maintainRoutes);
app.use("/jobreports", jobReportRoutes);

app.use("/images", express.static(path.join(__dirname, "Item_images")));

mongoose
  .connect(

    "mongodb+srv://admin:MlRO4Wr0yQyWjAfB@cluster0.imz0nqj.mongodb.net/"
  )
  .then(() => console.log("Connected to Mongo DB"))
  .then(() => {
    app.listen(5000, () => {
      console.log("App listening on port 5000");
    });
  })
  .catch((err) => console.log(err));