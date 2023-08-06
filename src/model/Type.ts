import mongoose, { Schema } from "mongoose";

interface Type {
  userId: Schema.Types.ObjectId;
  isDispatch: boolean;
  name: string;
}

const typeSchema: Schema<Type> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isDispatch: { type: Boolean, default: false },
    name: { type: String, required: true },
  },
  {
    timestaps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("type", typeSchema);
