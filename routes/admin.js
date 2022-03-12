const express = require("express");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const router = express.Router();
const Admin = require("../models/admin.model");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// for generating secrete token
// require('crypto').randomBytes(64).toString('hex')

router.post("/register", async (req, res) => {
  try {
    const { password, email, confirmPassword, username } = req.body;

    const existingAdmin = await Admin.findOne({ email: email });
    
    //   Validating Register Details

    // Checking if user has submitted the necessary information
    if (!password || !email || !confirmPassword || !username) {
      res.status(400).json({ msg: "Not all the fields has been filled" });
    }

    // Checking if the eamil is valid
    else if (!email.includes("@")) {
      res.status(400).json({ msg: "Email should have an @ symbol" });
    }

    // Checking if password and confirmPassword are the same
    else if (password != confirmPassword) {
      res
        .status(400)
        .json({ msg: "Enter the same password twice for verification" });
    }

    // Checking if user dosen't have an account with the same email
    else if (existingAdmin) {
      res
        .status(400)
        .json({ msg: "An account with the same email already exists" });
    } else {
      // Encrypting or Hashing User password before storing it in the database
      const salt = await bycrypt.genSalt();
      const passwordHash = await bycrypt.hash(password, salt);

      // Creating a newUser variable which is ready to be saved in the db
      const newAdmin = new Admin({
        email: email,
        password: passwordHash,
        username: username,
      });

      // Saving the user details in the db
      const savedUser = await newAdmin
        .save()
        .then(() => res.json("Admin added!"))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});


// Login
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });
    const admin = await Admin.findOne({ username: username });
    if (!admin)
      return res
        .status(400)
        .json({ msg: "No account with this username has been registered." });
    const isMatch = await bycrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
    const token = jwt.sign(
      { id: admin._id },
      "ef3ee8a527ee80718e822c040d24998b833aba902e26e3adce3b571786f9a39753f60cfa1917d26df04b03df8ca29cb851f3b81559782445d15e6a10ec630005"
    );
    res.json({
      token,
      admin: { id: admin._id, username: admin.username },
      status: "SUCCESSFUL"
    });
  } catch (err) {
    res.status(500).json({ err });
  }
});


//Update Student
router.patch(
  "/:admin_id",
  async (req, res) => {
    try {
      const updatePassword = req.body.password
      const newSalt = await bycrypt.genSalt();
      const newPassword = await bycrypt.hash(updatePassword, newSalt);
      const updateAdmin = await Admin.updateMany(
        { _id: req.params.admin_id },
        {
          $set: {
            username: req.body.username,
            password: newPassword,
          },
        }
      );
      res.status(200).send("Admin updated Successfully");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Unable to update Admin information");
    }
  }
);



// Check if token is valid
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(
      token,
      "ef3ee8a527ee80718e822c040d24998b833aba902e26e3adce3b571786f9a39753f60cfa1917d26df04b03df8ca29cb851f3b81559782445d15e6a10ec630005"
    );
    if (!verified) return res.json({ value: false });
    const admin = await Admin.findById(verified.id);
    if (!admin) return res.json({ value: false });
    return res.json(true);
  } catch (err) {
    res.status(500).json({ err });
  }
});



router.get("/", async (req, res) => {
  Admin.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

module.exports = router;
