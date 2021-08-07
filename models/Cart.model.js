const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  toClient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  selectedMedicine: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drug",
    },
  ],
  total_price: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
