/** 
  Author: Piera Blum
  Date: 26.06.2024
  Description: This is a PHP script to see who is logged in or to log out.
*/

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { errormessage } = require("../../loginsignup/src/common/formcss");
require("dotenv").config();

// Function to generate a 4-digit verification code
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
// Function to validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Route for user signup
router.post("/signup", async (req, res) => {
    const { name, email, password, dob, address } = req.body;
    if (!email || !password || !name || !dob || !address) {
      return res.status(422).send({ error: "Please fill all the fields" });
    }
    if (!isValidEmail(email)) {
      return res.status(422).send({ error: "Invalid email format" });
    }
    const savedUser = await User.findOne({ email: email });
    if (savedUser) {
      return res.status(422).send({ error: "Email already in use" });
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); 
    console.log("Hashed password:", hashedPassword);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      dob,
      address,
    });
    // Save the user and generate a token
    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      console.log("User registered successfully");
      res.send({ message: "User Registered Successfully", token });
    } catch (err) {
      console.log("Error saving user:", err);
      res.status(500).send({ error: "Internal server error" });
    }
  });
  
  
// Route for user signin
  router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log("Signin request received with email:", email); 
    if (!email || !password) {
      console.log("Missing email or password"); 
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    // Authenticate user
    try {
      const savedUser = await User.findOne({ email: email });
      if (!savedUser) {
        console.log("User not found with email:", email); 
        return res.status(422).json({ error: "Invalid Credentials" });
      }
      console.log("Stored password hash:", savedUser.password);
      const isMatch = await bcrypt.compare(password, savedUser.password);
      if (isMatch) {
        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        console.log("User signed in successfully:", email); 
        res.send({ message: "User Signed In Successfully", token });
      } else {
        console.log("Incorrect password for user:", email);
        return res.status(422).json({ error: "Invalid Credentials" });
      }
    } catch (err) {
      console.log("Error during signin:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  


// Route for email verification
router.post("/verify", async (req, res) => {
    const { email, password, name, dob, address } = req.body;

    // Generate a 4-digit verification code
    const verificationCode = generateVerificationCode();
    console.log(verificationCode);

    res.json({ message: "Verification Code Generated", udata: { email, password, name, dob, address, verificationCode } });
});

module.exports = router;
