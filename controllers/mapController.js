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
    let animalData = fs.readFileSync(
      path.join(__dirname, "../public/Animal.json"),
      "utf-8"
    );
    allBound = JSON.parse(allBound);
    animalData = JSON.parse(animalData);
    let location = req.body;
    let nearMarks = [];
    RTree.instruction.search(allBound, location, nearMarks);
    // let root=allBound.find(bound=>bound.type==="root")
    // RTree.instruction.searchDataBaseTree(allBound,root,location,nearMark)
    nearMarks.forEach((mark, idx) => {
      let result = animalData.find((data) => data.number === mark.number);
      delete result.number;
      nearMarks[idx] = { ...mark, ...result };
    });
    //console.log(nearMarks)
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
    let animal_data = fs.readFileSync(
      path.join(__dirname, "../public/Animal.json"),
      "utf-8"
    );

    let locations = JSON.parse(data);
    let animal = JSON.parse(animal_data);
    let roots = RTree.instruction.created(locations);
    roots["nodesNum"] = locations.length;

    animal = animal.slice(0, 3);
    /** for not recursive solve */
    //let total=RTree.instruction.visit(roots)
    // let allNode=RTree.instruction.allNode
    // roots.type="root"
    // allNode.push(roots)//add parent to node
    // allNode.reverse()

    // MapData.insertMany(allNode)
    // .then(function(){
    //     console.log("Data inserted")  // Success
    // }).catch(function(error){
    //     console.log(error)      // Failure
    // });

    let writeData = JSON.stringify(roots, null, "\t");
    let writeAnimal = JSON.stringify(animal, null, "\t");
    fs.writeFileSync(
      path.join(__dirname, "../public/RTree.json"),
      writeData,
      "utf-8"
    );
    fs.writeFileSync(
      path.join(__dirname, "../public/Animal.json"),
      writeAnimal,
      "utf-8"
    );
    res.send({ status: 1 });
  } catch (error) {
    res.send({ status: 0 });
  }
};
const mapGetAllMarker = (req, res) => {
  const data = fs.readFileSync(
    path.join(__dirname, "../public/location.json"),
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
};
