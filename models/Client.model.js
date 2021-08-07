const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0,
  },
  cartInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart"
  }
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;