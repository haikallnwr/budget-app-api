const express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const route = express.Router();

route.get("/allUser", userController.getAllUser);
route.get("/myProfile", auth, userController.getUser);
route.put("/updateProfile", auth, userController.updateUser);

module.exports = route;
