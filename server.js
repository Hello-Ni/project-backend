//import package
var mongodb=require('mongodb');
const express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors');
var crypto=require('crypto');
var fs=require('fs');
//create express service
const app = express()
const port = 8000
var urlencodedParser = bodyParser.urlencoded({ extended: false});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
//form 表單input必須加入name
app.use(cors());

//create mongpDB Client
var MongoClient=mongodb.MongoClient;


app.post('/login',urlencodedParser, (req, res) => {
    console.log(req.body)
    if(req.body.email=="" || req.body.password=="")
      res.send("empty!");
    else if(req.body.email==="ainimal@123" && req.body.password==="123123"){
       console.log("success");
        res.send("successful")
    }
    else
        res.send("fail")
})
app.post('/mapSearch',urlencodedParser,(req,res)=>{
  console.log(req.body);
  res.send("successful")

})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})