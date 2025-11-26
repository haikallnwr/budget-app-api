const User = require("../models/user");
const Category = require("../models/category");
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
