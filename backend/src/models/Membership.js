import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    memberId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
    aadhaar: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    membershipType: {
      type: String,
      enum: ["6_months", "1_year", "2_years"],
      required: true,
    },
    status: { type: String, enum: ["active", "expired"], default: "active" },
  },
  { timestamps: true }
);

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;

