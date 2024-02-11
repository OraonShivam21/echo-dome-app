const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, { expiresIn: "7d" });
};

// get or search all users
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json({ users });
  } catch (error) {
    res.status(400).json({ error: error || "something went wrong" });
  }
});

// register new users
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  try {
    if (!name || !email || !password)
      res.status(400).json({ error: "Please enter all the fields" });

    const userExists = await User.findOne({ email });

    if (userExists) res.status(400).json({ error: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (!user) throw "User not found";

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ error: error || "something went wrong" });
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password)))
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    else throw "Invalid email or password";
  } catch (error) {
    res.status(400).json({ error: error || "something went wrong" });
  }
});

module.exports = { allUsers, registerUser, authUser };
