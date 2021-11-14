const mongoose = require("mongoose");

const TurfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Turf", TurfSchema);
