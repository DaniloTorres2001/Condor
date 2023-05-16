const router = require("express").Router();
const auth = require("../controllers/auth");

router
  .post("/signin", auth.login)
  .post("/signup", auth.register);

module.exports = router;
