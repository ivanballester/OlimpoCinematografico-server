const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    text: { type: String, required: [true, "Text required"] },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
