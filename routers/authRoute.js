const express = require("express");
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");
const route = express.Router();

route.post("/register", authController.register);
route.post("/login", authController.login);
route.post("/logout", authController.logout);
route.put("/changePassword", auth, authController.changePassword);

module.exports = route;
