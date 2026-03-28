import { validationResult } from "express-validator";
import User from "../models/User.js";

export const listUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, isActive, role, contact, aadhaar, startDate, endDate, membershipType } = req.body;
  if (name !== undefined) user.name = name;
  if (isActive !== undefined) user.isActive = !!isActive;
  if (role !== undefined) user.role = role;
  if (contact !== undefined) user.contact = contact;
  if (aadhaar !== undefined) user.aadhaar = aadhaar;
  if (startDate !== undefined) user.startDate = startDate;
  if (endDate !== undefined) user.endDate = endDate;
  if (membershipType !== undefined) user.membershipType = membershipType;

  const updated = await user.save();
  res.json(updated);
};

