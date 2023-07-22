import mongoose, { Schema, Document } from "mongoose";

interface Challan {
  userId: Schema.Types.ObjectId;
  challan_number: number;
  date: Date;
  from: string;
  grade: string;
  type: string;
  color: string;
  remarks: string;
  quantity: number;
  weight: number;
}

const challanSchema: Schema<Challan> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    challan_number: {
      type: Number,
      required: true,
      min: [1, "Quantity must be greater than 0"],
    },
    date: { type: Date, required: true },
    from: { type: String, required: true },
    grade: { type: String },
    type: { type: String, required: true },
    color: { type: String, required: true },
    remarks: { type: String },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be greater than 0"],
    },
    weight: {
      type: Number,
      required: true,
      min: [1, "Weight must be greater than 0"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("challan", challanSchema);
