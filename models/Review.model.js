// models/Review.model.js
const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    text: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = model("Review", reviewSchema);
