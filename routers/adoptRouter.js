const express = require("express");
const router = express.Router();
const adoptController = require("../controllers/adoptController");
router.post("/create", adoptController.createAnimal);
router.post("/findAnimal", adoptController.findAnimal);
router.post("/storeHistory", adoptController.storeHistory);
router.post("/recommend", adoptController.recommend);
router.get("/getAllBreed", adoptController.getAllBreed);

module.exports = router;
