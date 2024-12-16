var express = require("express");
var {
  userRegisterHandler,
  userLoginHandler,
} = require("../controllers/login_controller");
var router = express.Router();

router.post("/register", userRegisterHandler);
router.post("/login", userLoginHandler);

module.exports = router;
