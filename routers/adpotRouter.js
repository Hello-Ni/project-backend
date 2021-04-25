const express = require("express");
const router = express.Router();
const adoptController = require("../controllers/adoptController");
router.post("/create", adoptController.createAnimal);
router.post("/recommend", adoptController.findAnimal);
router.post("/findAnimal", adoptController.findAnimal);
module.exports = router;
