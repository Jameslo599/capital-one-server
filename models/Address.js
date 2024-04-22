const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  street_address: {
    type: String,
    required: true,
  },
  apartment_suite: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
  mail_address: {
    type: String,
    required: false,
  },
  mail_apartment: {
    type: String,
    required: false,
  },
  mail_city: {
    type: String,
    required: false,
  },
  mail_state: {
    type: String,
    required: false,
  },
  mail_zip: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Address", AddressSchema);
