var express = require("express");
var {
  userRegisterHandler,
  userLoginHandler,
} = require("../controllers/login_controller");
const verifyUser = require('../middleware/verifyUser_middleware')
var router = express.Router();

router.post("/register", userRegisterHandler);
router.post("/login", userLoginHandler);
router.get("/chat", verifyUser, (req, res) => {
  return console.log('User logged In.');
})

module.exports = router;
