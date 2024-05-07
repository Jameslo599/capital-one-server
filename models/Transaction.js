const mongoose = require("mongoose");

const TransactSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: false,
  },
  recipient: {
    type: String,
    required: false,
  },
  amount: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Transaction", TransactSchema);
