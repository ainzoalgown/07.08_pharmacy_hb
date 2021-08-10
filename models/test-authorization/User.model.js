const { Schema, model } = require("mongoose");

const userSchema = Schema(
  {
    name: {
      type: String,
      unique: "Такой пользователь уже существует",
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: String,
        ref: "Role",
      },
    ],
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "Cart"
    },
    balance: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
