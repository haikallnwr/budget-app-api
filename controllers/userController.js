const User = require("../models/user");

//buat test/cek
exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User ID in controller:", req.user._id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const update = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select("-password");

    if (req.body.password) {
      return res.status(400).json({ message: "Password cannot be updated here" });
    }
    res.json({ update });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
