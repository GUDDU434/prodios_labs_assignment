const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports.RegisterUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);

    const user = new User({ name, email, password: hash });
    await user.save();
    res.status(201).send({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
module.exports.LoginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ email: username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user?.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refresh_token = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("accessToken", token, { httpOnly: true });
    res.cookie("refreshToken", refresh_token, { httpOnly: true });

    res.status(200).send({
      accessToken: token,
      refreshToken: refresh_token,
      message: "User logged in successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
};

module.exports.RefreshToken = (req, res) => {
  try {
    const token = req?.cookies?.refreshToken || req?.body?.refreshToken;
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("accessToken", newToken, { httpOnly: true });
    res.status(200).send({
      accessToken: newToken,
      message: "Token refreshed successfully",
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.UpdateUserDetails = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.userId, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports.LogoutUser = (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.send({ message: "User logged out successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
