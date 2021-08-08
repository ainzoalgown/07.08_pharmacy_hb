const { Schema, model } = require("mongoose");

const drugSchema = Schema({
  name: {
    required: true,
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  price: {
    required: true,
    type: Number,
  },
  needPrescription: {
    required: true,
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
});

module.exports = model("Drug", drugSchema);
