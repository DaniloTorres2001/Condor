const router = require("express").Router();
const pago = require("../controllers/pagos");

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

router
  .get("/", verifyJWT, canAccess([constants.ROLES.administrator]), pago.getAll)
  .get("/:id", verifyJWT, canAccess([constants.ROLES.administrator]), pago.get);
module.exports = router;
