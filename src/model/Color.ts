import mongoose, { Schema } from "mongoose";

interface Color {
  userId: Schema.Types.ObjectId;
  isDispatch: boolean;
  name: string;
}

const colorSchema: Schema<Color> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    isDispatch: { type: Boolean, default: false },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("color", colorSchema);
