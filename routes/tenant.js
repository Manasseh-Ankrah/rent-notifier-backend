const express = require("express");
const mongoose = require("mongoose");
const bycrypt = require("bcrypt");
const router = express.Router();
const Tenant = require("../models/tenant.model");
// const Admin = require("../models/admin.model");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// for generating secrete token
// require('crypto').randomBytes(64).toString('hex')

// Fetching all Tenants
router.get("/:adminId", async(req, res) => {
  try {
      const newTenant = await Tenant.find({"createdBy":{'$exists': true}}).then(e => {
        const newData = e.filter(info => info.createdBy == req.params.adminId)
        if (newData) {
          res.status(200).send(newData)
          console.log('tenant ==>>',newData)
        }
      });
    } catch (error) {
      res.json({ message: 'Null' });
    }
  });

router.post("/add", async (req, res) => {
  try {
    const { tenant, location, propType, startDate,dueDate,notificationDate, nDay, nMonth, nYear, initialPayment, monthlyCost, balance, createdBy } = req.body;

    // const existingAdmin = await Admin.findOne({ email: email });
    
    //   Validating Register Details

    // Checking if user has submitted the necessary information
    if (!tenant || !location || !propType || !startDate || !dueDate || !notificationDate || !nDay || !nMonth || !nYear || !initialPayment || !monthlyCost || !balance || !createdBy) {
      res.status(400).json({ msg: "Not all the fields has been filled" });
    } else {
      // Creating a new Tenant record which is ready to be saved in the db
      const newTenant = new Tenant({
        tenant: tenant,
        location: location,
        propType: propType,
        startDate: startDate,
        dueDate: dueDate,
        notificationDate: notificationDate,
        nDay: nDay,
        nMonth: nMonth,
        nYear: nYear,
        initialPayment: initialPayment,
        monthlyCost: monthlyCost,
        balance: balance,
        createdBy: createdBy,
      });

      // Saving the user details in the db
      const savedTenant = await newTenant
        .save()
        .then((tenant) => res.json(tenant))
        .catch((err) => res.status(400).json("Error: " + err));
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});


// Login
// router.post("/login", async (req, res) => {
//   try {
//     console.log(req.body);
//     const { username, password } = req.body;

//     if (!username || !password)
//       return res.status(400).json({ msg: "Not all fields have been entered." });
//     const admin = await Admin.findOne({ username: username });
//     if (!admin)
//       return res
//         .status(400)
//         .json({ msg: "No account with this username has been registered." });
//     const isMatch = await bycrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });
//     const token = jwt.sign(
//       { id: admin._id },
//       "ef3ee8a527ee80718e822c040d24998b833aba902e26e3adce3b571786f9a39753f60cfa1917d26df04b03df8ca29cb851f3b81559782445d15e6a10ec630005"
//     );
//     res.json({
//       token,
//       admin: { id: admin._id, username: admin.username },
//       status: "SUCCESSFUL"
//     });
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });



// Tenant Delete Request
router.delete("/:tenantId", async (req, res) => {
  try {
    const getTenant = await Tenant.findById(req.params.tenantId);
    if (!getTenant) {
      return res.status(404).json({ msg: "Tenant not found" });
    }
    await getTenant.remove();

    res.status(200).send("Tenant was deleted Successfully");
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ msg: "Tenant not found" });
    }
    res.status(500).send("Unable to delete Tenant");
  }
});


//Update Student
// router.patch(
//   "/:tenantId",
//   async (req, res) => {
//     try {
//       const updateTenant = await Tenant.updateMany(
//         { _id: req.params.tenantId },
//         {
//           $set: {
//             tenant: req.body.tenant, 
//             location: req.body.location, 
//             propType: req.body.propType, 
//             startDate: req.body.startDate,
//             dueDate: req.body.dueDate,
//             notificationDate: req.body.notificationDate, 
//             nDay: req.body.nDay, 
//             nMonth: req.body.nMonth, 
//             nYear: req.body.nYear,
//             initialPayment: req.body.initialPayment,
//             monthlyCost: req.body.monthlyCost,
//             balance: req.body.balance,
//           },
//         }
//       ) 
//       .then((tenant) => res.json(tenant))
//       .catch((err) => res.status(400).json("Error: " + err));;
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Unable to update Tenant information");
//     }
//   }
// );



// Check if token is valid
// router.post("/tokenIsValid", async (req, res) => {
//   try {
//     const token = req.header("x-auth-token");
//     if (!token) return res.json(false);
//     const verified = jwt.verify(
//       token,
//       "ef3ee8a527ee80718e822c040d24998b833aba902e26e3adce3b571786f9a39753f60cfa1917d26df04b03df8ca29cb851f3b81559782445d15e6a10ec630005"
//     );
//     if (!verified) return res.json({ value: false });
//     const admin = await Admin.findById(verified.id);
//     if (!admin) return res.json({ value: false });
//     return res.json(true);
//   } catch (err) {
//     res.status(500).json({ err });
//   }
// });



// router.get("/", async (req, res) => {
//   Admin.find((err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });

module.exports = router;
