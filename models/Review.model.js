const { Schema, model } = require("mongoose");

const reviewSchema = new Schema({
  text: {
    type: String,
    required: [true, "Text required"],
  },
});

module.exports = model("Review", reviewSchema);
