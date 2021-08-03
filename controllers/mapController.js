const fs = require("fs");
const path = require("path");
//const MapData = require('../models/Map');
const RTree = require("./RTree");
const base = "https://542b3bc41347.ngrok.io";
const mapSearch = (req, res) => {
  try {
    //console.log(req.body);
    let allBound = fs.readFileSync(
      path.join(__dirname, "../public/RTree.json"),
      "utf-8"
    );
    allBound = JSON.parse(allBound);
    let location = req.body;
    let nearMarks = [];
    let details = [];
    RTree.instruction.search(allBound, location, nearMarks, details);
    console.log(nearMarks);
    res.send({ places: nearMarks, details: details });
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
    let allAnimal = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../public/Animal/dog/dog.json"),
        "utf-8"
      )
    );
    let allBound = JSON.parse(allBoundFileData);
    let new_detail = JSON.parse(req.body.detail);
    console.log(allBound.nodesNum);
    new_detail["number"] = allBound.nodesNum;
    new_detail["age"] = "成年";
    new_detail["shape"] = "中型";
    new_detail["color"] = "白色";
    new_detail["image"] = base + "/Animal/dog/212.jpg";
    new_detail["place"] = JSON.parse(req.body.location);
    console.log(new_detail);
    allAnimal.push(new_detail);
    let location = JSON.parse(req.body.location);
    let newBounds = RTree.instruction.insert(
      allBound,
      location,
      allBound.nodesNum++,
      new_detail
    );
    console.log(newBounds);
    let writeTree = JSON.stringify(newBounds, null, "\t");
    let writeAnimal = JSON.stringify(allAnimal, null, "\t");
    fs.writeFileSync(
      path.join(__dirname, "../public/RTree.json"),
      writeTree,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(__dirname, "../public/Animal/dog/dog.json"),
      writeAnimal,
      "utf-8"
    );
    res.send({ status: "OK" });
  } catch (error) {
    res.send({ status: "fail" });
  }
};
const mapCreate = (req, res) => {
  try {
    console.log("reset");
    const dogs = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../public/Animal/dog/dog.json"),
        "utf-8"
      )
    );
    const cats = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../public/Animal/cat/cat.json"),
        "utf-8"
      )
    );
    let data = [...dogs, ...cats];
    let roots = RTree.instruction.created(data);
    roots["nodesNum"] = data.length;
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
  const dogs = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../public/Animal/dog/dog.json"),
      "utf-8"
    )
  );
  const cats = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../public/Animal/cat/cat.json"),
      "utf-8"
    )
  );
  let place = [];
  let detail = [];
  let data = [...dogs, ...cats];
  data.forEach((e, i) => {
    place.push(e.place);
    detail.push(e);
    delete detail[i].place;
  });
  console.log(place);
  res.send({ place: place, detail: detail });
};
module.exports = {
  mapSearch,
  mapCreate,
  mapInsert,
  mapGetAllMarker,
  showRTree,
};
