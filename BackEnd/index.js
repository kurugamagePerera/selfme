const express = require("express");
const mongoose = require("mongoose");
const app = express();
const itemRoutes = require("./Routes/ItemRoutes");
const employeeRoutes = require("./Routes/TechRoute/employeeRoutes");
const assignmentRoutes = require("./Routes/TechRoute/assignmentRoutes");
const cors = require("cors");
const path = require("path");


//Middleware
app.use(cors());
app.use(express.json());
app.use("/items", itemRoutes);
app.use("/employees", employeeRoutes);
app.use("/assignments", assignmentRoutes);

app.use("/images", express.static(path.join(__dirname, "Item_images")));

mongoose
  .connect(
    "mongodb+srv://adminSelfme:P40YIFy04Am8rnDe@cluster0.4bp3tta.mongodb.net/inventoryDBs"
  )
  .then(() => console.log("Connected to Mongo DB"))
  .then(() => {
    app.listen(5000, () => {
      console.log("App listening on port 5000");
    });
  })
  .catch((err) => console.log(err));
