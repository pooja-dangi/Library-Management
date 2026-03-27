import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Membership from "../models/Membership.js";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Seeding data...");
  await Promise.all([User.deleteMany({}), Book.deleteMany({}), Membership.deleteMany({})]);

  const admin = await User.create({
    name: "Admin",
    userId: "admin001",
    password: "Admin@123",
    role: "admin",
    isActive: true,
  });

  const user = await User.create({
    name: "User One",
    userId: "user001",
    password: "User@123",
    role: "user",
    isActive: true,
  });

  await Membership.create([
    {
      memberId: "M0001",
      name: "Ravi Kumar",
      contact: "9999999999",
      aadhaar: "1234-5678-9012",
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      membershipType: "1_year",
      status: "active",
    },
  ]);

  await Book.create([
    {
      name: "Clean Code",
      type: "book",
      author: "Robert C. Martin",
      serialNumber: "B-1001",
      status: "available",
      quantity: 3,
      procurementDate: new Date("2024-01-15"),
    },
    {
      name: "The Pragmatic Programmer",
      type: "book",
      author: "Andrew Hunt",
      serialNumber: "B-1002",
      status: "available",
      quantity: 2,
      procurementDate: new Date("2024-02-20"),
    },
    {
      name: "Inception",
      type: "movie",
      author: "Christopher Nolan",
      serialNumber: "M-2001",
      status: "available",
      quantity: 1,
      procurementDate: new Date("2023-11-05"),
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login: userId=admin001 password=Admin@123");
  console.log("User login: userId=user001 password=User@123");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (e) => {
  console.error(e);
  try {
    await mongoose.connection.close();
  } catch {
    // ignore
  }
  process.exit(1);
});

