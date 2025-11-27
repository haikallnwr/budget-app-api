const express = require("express");
const categoryController = require("../controllers/categoryController");
const auth = require("../middlewares/auth");
const route = express.Router();

route.get("/", auth, categoryController.getCategories);
route.post("/", auth, categoryController.createCategory);
route.delete("/:id", auth, categoryController.delete);

module.exports = route;
