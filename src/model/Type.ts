import mongoose, { Schema } from "mongoose";

interface Type {
  userId: Schema.Types.ObjectId;
  name: string;
}

const typeSchema: Schema<Type> = new Schema(
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

module.exports = mongoose.model("type", typeSchema);
