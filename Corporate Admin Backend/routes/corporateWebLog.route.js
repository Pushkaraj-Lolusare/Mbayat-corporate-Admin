const express = require('express');
const loginLogRouter = express.Router();
const CorporateLoginLogModel = require('../model/corporateWebLog.model');
const moment = require("moment");

// loginLogRouter.put("/logout", async (req, res) => {
//     const { email } = req.body;
//     const logoutTime = moment().toISOString();

//     try {
//         // Update the logout time for the specified user
//         await CorporateLoginLogModel.findOneAndUpdate(
//             { email, logoutTime: { $exists: false } },
//             { logoutTime },
//             { new: true }
//         );

//         res.status(200).json({ message: "Logout successful" });
//     } catch (error) {
//         console.error("Logout error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });


loginLogRouter.get('/', async (req, res) => {
    const userId = req.body.userId;
    try {
        // Fetch login activity entries for the specified user
        const loginActivity = await CorporateLoginLogModel.find({ userId: userId }).sort({ loginTime: -1 }).limit(20);

        // Send the login activity data as a response
        res.status(200).json(loginActivity);
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: 'Internal server error' });
    }
});

loginLogRouter.delete("/:id", async (req, res) => {
    const productId = req.params.id;
    //   console.log("productid", productId);

    try {
        let cart = await CorporateLoginLogModel.findOneAndDelete({ _id: productId });
        // console.log("cartid", cart);
        return res.status(201).send({ msg: "Log Deleted" });
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

loginLogRouter.delete('/', async(req, res) => {
    const userId = req.body.userId;
    //   console.log("productid", productId);

    try {
        let cart = await CorporateLoginLogModel.deleteMany({ userId: userId });
        // console.log("cartid", cart);
        return res.status(201).send({ msg: "Log Deleted" });
    } catch (err) {
        return res.status(400).send(err.message);
    }
  });
  

module.exports = loginLogRouter