const { Schema, model } = require("mongoose");

const roleSchema = Schema({
  value: String
});

module.exports = model("Role", roleSchema);