/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: Defines a Mongoose schema for users with required fields.
*/

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

mongoose.model("User", userSchema);
