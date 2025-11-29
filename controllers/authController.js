const User = require("../models/user");
const Account = require("../models/account");
const jwt = require("jsonwebtoken");
const { doHash, doHashValidation } = require("../utils/hashing");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password required" });
    }

    //Check existed email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already existed" });
    }

    const hashedPassword = await doHash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    await Account.create({
      user_id: savedUser._id,
      name: "Cash",
      type: "Cash",
      init_balance: 0,
      current_balance: 0,
      isDefault: true,
    });

    res.status(201).json({ message: "User Successfuly created", user: savedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Check email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email not found!" });
    }

    const validPassword = await doHashValidation(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const matchPassword = await doHashValidation(oldPassword, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Old password doesn't match" });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from old password" });
    }

    const hashed = doHash(newPassword, 12);
    user.password = hashed;

    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
