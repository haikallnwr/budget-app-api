const Category = require("../models/category");

exports.getCategories = async (req, res) => {
  try {
    const category = await Category.find({
      $or: [{ user_id: null }, { user_id: req.user._id }],
    });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  const { name, type } = req.body;
  try {
    const category = new Category({
      user_id: req.user._id,
      name,
      type,
    });

    await category.save();
    res.status(201).json({ message: "Category created", category: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
