const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
router.post("/login", accountController.login);
router.post("/signup", accountController.signup);

module.exports = router;
