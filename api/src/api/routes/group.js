const router = require("express").Router();
const group = require("../controllers/groups");

const constants = require("../../config/constants");
const { verifyJWT, canAccess } = require("../middlewares/auth");

router
  .get("/", verifyJWT, canAccess([constants.ROLES.administrator]), group.getAll)
  .get("/:id", verifyJWT, canAccess([constants.ROLES.administrator]), group.get)
  .post(
    "/",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    group.create
  )
  .put(
    "/:id",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    group.update
  )
  .delete(
    "/:id",
    verifyJWT,
    canAccess([constants.ROLES.administrator]),
    group.destroy
  );

module.exports = router;
