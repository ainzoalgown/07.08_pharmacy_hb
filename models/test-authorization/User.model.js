const { Schema, model } = require("mongoose");

const userSchema = Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    roles: [
      {
        type: String,
        ref: "Role"
      }
    ],
  },{ timestamps: true }
);

module.exports = model("User", userSchema);
