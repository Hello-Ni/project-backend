const express = require("express");
const router = express.Router();
const adoptController = require("../controllers/adoptController");
router.post("/create", adoptController.createAnimal);
router.post("/recommend", adoptController.recommend);
router.post("/findAnimal", adoptController.findAnimal);
module.exports = router;
