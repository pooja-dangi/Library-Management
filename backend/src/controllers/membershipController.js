import { validationResult } from "express-validator";
import Membership from "../models/Membership.js";

export const createMembership = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    memberId,
    name,
    contact,
    aadhaar,
    startDate,
    endDate,
    membershipType,
    status,
  } = req.body;

  const existing = await Membership.findOne({ memberId });
  if (existing) return res.status(400).json({ message: "Member ID already exists" });

  const membership = await Membership.create({
    memberId,
    name,
    contact,
    aadhaar,
    startDate,
    endDate,
    membershipType,
    status: status || "active",
  });

  res.status(201).json(membership);
};

export const updateMembership = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const membership = await Membership.findById(req.params.id);
  if (!membership) return res.status(404).json({ message: "Membership not found" });

  const fields = [
    "memberId",
    "name",
    "contact",
    "aadhaar",
    "startDate",
    "endDate",
    "membershipType",
    "status",
  ];

  for (const f of fields) {
    if (req.body[f] !== undefined) membership[f] = req.body[f];
  }

  const updated = await membership.save();
  res.json(updated);
};

export const getMemberships = async (req, res) => {
  const memberships = await Membership.find().sort({ createdAt: -1 });
  res.json(memberships);
};

export const getMembershipById = async (req, res) => {
  const membership = await Membership.findById(req.params.id);
  if (!membership) return res.status(404).json({ message: "Membership not found" });
  res.json(membership);
};

export const deleteMembership = async (req, res) => {
  const membership = await Membership.findById(req.params.id);
  if (!membership) return res.status(404).json({ message: "Membership not found" });
  await membership.deleteOne();
  res.json({ message: "Membership deleted" });
};

export const getNextMemberId = async (req, res) => {
  try {
    // Find the latest memberId
    const last = await Membership.findOne().sort({ memberId: -1 });
    if (!last) return res.json({ nextId: "M0001" });

    // Match prefix and number
    const match = last.memberId.match(/^([a-zA-Z]+)(\d+)$/);
    if (!match) {
      // If it doesn't match the standard format, just increment the number?
      // Or default to M0001
      return res.json({ nextId: "M0001" });
    }

    const prefix = match[1];
    const numStr = match[2];
    const nextNum = parseInt(numStr, 10) + 1;
    const paddedNum = String(nextNum).padStart(numStr.length, "0");

    res.json({ nextId: `${prefix}${paddedNum}` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

