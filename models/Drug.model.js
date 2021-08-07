const mongoose = require("mongoose");

const drugSchema = mongoose.Schema({
  name: {
    required: true,
    type: String
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },
  price: {
    required: true,
    type: Number
  },
  needPrescription: {
    required: true,
    type: Boolean
  },
  image: {
    type: String
  }
})

const Drug = mongoose.model("Drug", drugSchema);

module.exports = Drug;