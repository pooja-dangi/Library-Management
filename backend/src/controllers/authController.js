import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    name,
    userId,
    password,
    role,
    isActive,
    contact,
    aadhaar,
    startDate,
    endDate,
    membershipType,
  } = req.body;

  try {
    const existing = await User.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "User ID already exists" });
    }

    const user = await User.create({
      name,
      userId,
      password,
      role: role || "user",
      isActive: isActive !== undefined ? isActive : true,
      contact,
      aadhaar,
      startDate,
      endDate,
      membershipType,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      userId: user.userId,
      role: user.role,
      isActive: user.isActive,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User is inactive" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      userId: user.userId,
      role: user.role,
      isActive: user.isActive,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

