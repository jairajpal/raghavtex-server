import mongoose, { Schema } from "mongoose";

interface Company {
  userId: Schema.Types.ObjectId;
  name: string;
}

const companySchema: Schema<Company> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: { type: String, required: true },
  },
  {
    timestaps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("company", companySchema);
