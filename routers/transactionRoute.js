const express = require("express");
const auth = require("../middlewares/auth");
const transactionContoller = require("../controllers/transactionController");
const route = express.Router();

route.post("/", auth, transactionContoller.createTransaction);
route.get("/", auth, transactionContoller.getTransaction);
route.get("/:id", auth, transactionContoller.getTransactionById);
route.put("/:id", auth, transactionContoller.updateTransaction);
route.delete("/:id", auth, transactionContoller.deleteTransaction);

module.exports = route;
