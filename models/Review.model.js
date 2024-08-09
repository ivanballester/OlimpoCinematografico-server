const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    text: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = model("Review", reviewSchema);
