import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Transaction from "../models/Transaction.js";

dotenv.config();

const run = async () => {
  await connectDB();

  console.log("Seeding data...");
  await Promise.all([User.deleteMany({}), Book.deleteMany({}), Transaction.deleteMany({})]);

  const admin = await User.create({
    name: "Admin",
    userId: "admin001",
    password: "Admin@123",
    role: "admin",
    isActive: true,
  });

  const user = await User.create({
    name: "Ravi Kumar",
    userId: "user001",
    password: "User@123",
    role: "user",
    isActive: true,
    contact: "9999999999",
    aadhaar: "1234-5678-9012",
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    membershipType: "1_year",
  });

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
      name: "The Art of Unit Testing",
      type: "book",
      author: "Roy Osherove",
      serialNumber: "B-1003",
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

