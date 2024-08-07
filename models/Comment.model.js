const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    text: { type: String, required: [true, "Text required"] },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
