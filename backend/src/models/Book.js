import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["book"], default: "book" },
    author: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["available", "issued", "lost", "maintenance"],
      default: "available",
    },
    quantity: { type: Number, default: 1, min: 1 },
    procurementDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;

