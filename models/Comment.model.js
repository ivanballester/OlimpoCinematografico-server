const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  text: { required: [true, "Text required"] },
});

module.exports = model("Comment", reviewSchema);
