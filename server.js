//import package

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

//create express service
const app = express();
const port = 8000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mapRouters = require("./routers/MapRouters");
const adoptRouter = require("./routers/adoptRouter");
const dbURI =
  "mongodb+srv://nihao:zrt05c4aa09@rtree.y7lh3.mongodb.net/MyDataBase?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
//form 表單input必須加入name
app.use(cors({ credentials: true, origin: "http://140.116.102.134:19000" }));
app.use(express.static("public"));
//create mongpDB Client

app.post("/login", urlencodedParser, (req, res) => {
  console.log(req.body);
  if (req.body.email == "" || req.body.password == "") res.send("empty!");
  else if (req.body.email === "ainimal@123" && req.body.password === "123123") {
    console.log("success");
    res.send("successful");
  } else res.send("fail");
});
app.use("/maps", mapRouters);
app.use("/adopt", adoptRouter);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
