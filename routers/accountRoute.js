const express = require("express");
const accountController = require("../controllers/accountController");
const auth = require("../middlewares/auth");
const route = express.Router();

route.get("/", auth, accountController.getAccount);
route.post("/", auth, accountController.createAccount);
route.put("/:id", auth, accountController.updateAccount);
route.delete("/:id", auth, accountController.deleteAccount);

module.exports = route;
