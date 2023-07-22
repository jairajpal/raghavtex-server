import mongoose, { Schema } from "mongoose";

interface Color {
  userId: Schema.Types.ObjectId;
  name: string;
}

const colorSchema: Schema<Color> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("color", colorSchema);
