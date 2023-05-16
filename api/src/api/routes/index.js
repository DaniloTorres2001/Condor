const express = require("express");
const auth = require("./auth");
const user = require("./user");
const group = require("./group");
const role = require("./role");
const carRide = require("./carRide");
const organization = require("./organization");
const pago = require("./pago");

const router = express.Router();

//Routes
router.use("/auth", auth);
router.use("/users", user);
router.use("/groups", group);
router.use("/roles", role);
router.use("/carRides", carRide);
router.use("/organizations", organization);
router.use("/pagos", pago);

module.exports = router;
