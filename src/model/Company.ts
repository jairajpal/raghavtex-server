import mongoose, { Schema } from "mongoose";

interface Company {
  userId: Schema.Types.ObjectId;
  isDispatch: boolean;
  name: string;
  gst: string;
  phone: string;
}

const companySchema: Schema<Company> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isDispatch: { type: Boolean, default: false },
    name: { type: String, required: true },
    gst: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("company", companySchema);
