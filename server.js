const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const Admin = require("./routes/admin");
const Tenant = require("./routes/tenant");
const Previous = require("./routes/previous");

const app = express();
require("dotenv").config();
// Port variable
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/admin", Admin);
app.use("/previous", Previous);
app.use("/tenant", Tenant);

app.get("/", (req, res) => {
  res.send("Backend active");
});

// Database Connection
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
