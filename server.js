//import package

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const crypto = require("crypto");
const fs = require("fs");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const formidable = require("formidable");
//create express service
const app = express();
const port = 8000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const mapRouters = require("./routers/MapRouters");
const adoptRouter = require("./routers/adoptRouter");
const accountRouter = require("./routers/accountRouter");
const dbURI =
  "mongodb+srv://nihao:zrt05c4aa09@rtree.y7lh3.mongodb.net/MyDataBase?retryWrites=true&w=majority";
const userTable = require("../backend/models/User");
var multer = require("multer");
var upload = multer();
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
//form 表單input必須加入name
app.use(cors({ credentials: true, origin: "http://localhost:8080" }));
app.use(express.static("public"));
//create mongpDB Client

app.post("/login", urlencodedParser, (req, res) => {
  console.log(req.body);
  if (req.body.email == "" || req.body.password == "") res.send("empty!");
  else if (req.body.email === "ni@1" && req.body.password === "111111") {
    console.log("success");
    res.send("successful");
  } else res.send("fail");
});
app.get("/user", urlencodedParser, (req, res) => {
  const user = new userTable();
  user.email = "ni@1";
  user.password = "123";
  user.history = {};
  user
    .save()
    .then(() => {
      console.log("successful");
    })
    .catch(() => {
      console.log("error");
    });
});
app.post("/test", upload.single("gid"), async (req, res) => {
  let formData = req.body;
  console.log(req.files);
  res.status(200).send(formData);
  //console.log(parseRes.fields.gid);
});
app.use("/maps", mapRouters);
app.use("/adopt", adoptRouter);
app.use("/account", accountRouter);
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
