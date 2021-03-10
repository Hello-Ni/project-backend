//import package
const mongodb=require('mongodb');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto=require('crypto');
const fs=require('fs');
//create express service
const app = express()
const port = 8000
const urlencodedParser = bodyParser.urlencoded({ extended: false});
const mapRouters = require('./routers/MapRouters');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
//form 表單input必須加入name
app.use(cors({credentials: true, origin: 'http://localhost:8080'}));
app.use(express.static('public'));
//create mongpDB Client
const MongoClient=mongodb.MongoClient;


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
app.post('/test',urlencodedParser,(req,res)=>{
  const data = fs.readFileSync('test.json', 'utf8')
  console.log(data)
})
app.use('/maps',mapRouters);
app.use('/maps',mapRouters)
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

