const express=require('express');
const router=express.Router();
const mapController=require('../controllers/mapController.js')
router.post('/search',mapController.mapSearch)
router.post('/create',mapController.mapCreate)
router.get('/getAllMarker',mapController.mapGetAllMarker)
module.exports = router