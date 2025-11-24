const express = require("express");
const connectDB = require("./config");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

const authRoute = require("./routers/authRoute");
const transactionRoute = require("./routers/transactionRoute");

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/transactions", transactionRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/", (req, res) => {
  res.json({ message: "Hello There!" });
});
