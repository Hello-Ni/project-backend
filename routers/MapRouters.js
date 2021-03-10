const express=require('express');
const router=express.Router();
const mapController=require('../controllers/mapController.js')
router.post('/search',mapController.map_search)
router.post('/create',mapController.map_create)
module.exports = router