const fs = require("fs");
const path = require("path");
//const MapData = require('../models/Map');
const RTree = require("./RTree");

const mapSearch = (req, res) => {
  try {
    //console.log(req.body)
    let allBound = fs.readFileSync(
      path.join(__dirname, "../public/RTree.json"),
      "utf-8"
    );
    allBound = JSON.parse(allBound);
    let location = req.body;
    let nearMarks = [];
    RTree.instruction.search(allBound, location, nearMarks);
    res.send({ data: nearMarks });
  } catch (error) {
    console.log(error);
  }
};
const mapInsert = (req, res) => {
  try {
    console.log("insert");
    let allBoundFileData = fs.readFileSync(
      path.join(__dirname, "../public/RTree.json"),
      "utf-8"
    );
    let animalFileData = fs.readFileSync(
      path.join(__dirname, "../public/Animal.json"),
      "utf-8"
    );
    let allBound = JSON.parse(allBoundFileData);
    let animalData = JSON.parse(animalFileData);
    let new_detail = JSON.parse(req.body.detail);
    new_detail["number"] = allBound.nodesNum;
    animalData.push(new_detail);
    let location = JSON.parse(req.body.location);
    let newBounds = RTree.instruction.insert(
      allBound,
      location,
      allBound.nodesNum++
    );

    let writeTree = JSON.stringify(newBounds, null, "\t");
    let writeAnimal = JSON.stringify(animalData, null, "\t");
    fs.writeFileSync(
      path.join(__dirname, "../public/RTree.json"),
      writeTree,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(__dirname, "../public/Animal.json"),
      writeAnimal,
      "utf-8"
    );
    // let root=allBound.find(bound=>bound.type==="root")
    // RTree.instruction.insertDataBaseTree(allBound,allBound.length,root,location);
    res.send({ status: "OK" });
  } catch (error) {
    res.send({ status: "fail" });
  }
};
const mapCreate = (req, res) => {
  try {
    console.log("reset");
    const data = fs.readFileSync(
      path.join(__dirname, "../public/location.json"),
      "utf-8"
    );

    let locations = JSON.parse(data);
    let roots = RTree.instruction.created(locations);
    roots["nodesNum"] = locations.length;
    let writeData = JSON.stringify(roots, null, "\t");
    fs.writeFileSync(
      path.join(__dirname, "../public/RTree.json"),
      writeData,
      "utf-8"
    );
    console.log("creaete finish");
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0 });
  }
};
const showRTree = (req, res) => {
  console.log("show RTree");
  let allBoundFileData = fs.readFileSync(
    path.join(__dirname, "../public/RTree.json"),
    "utf-8"
  );
  let rectangles = [];

  let allBound = JSON.parse(allBoundFileData);
  rectangles.push(allBound.boundary);
  RTree.instruction.searchRecs(allBound, rectangles);
  console.log(rectangles);
  res.send({ data: rectangles });
};
const mapGetAllMarker = (req, res) => {
  console.log("create");
  const data = fs.readFileSync(
    path.join(__dirname, "../public/location3.json"),
    "utf-8"
  );
  let locations = JSON.parse(data);
  res.send({ data: locations });
};
module.exports = {
  mapSearch,
  mapCreate,
  mapInsert,
  mapGetAllMarker,
  showRTree,
};
