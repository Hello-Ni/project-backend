const { randomInt } = require("crypto");
const fs = require("fs");
const path = require("path");
const AnimalData = require("../models/Animal");
const userData = require("../models/User");
const { use } = require("../routers/MapRouters");
const baseUrl = "https://34e72fc2cac1.ngrok.io";
const createAnimal = (req, res) => {
  try {
    const animal_data = new AnimalData(req.body);
    animal_data
      .save()
      .then((result) => {
        console.log(result);
      })
      .cache((error) => {
        console.log(error);
      });
  } catch (error) {}
};
const storeHistory = (req, res) => {
  let today = new Date().toLocaleDateString("zh-TW");
  let histories = JSON.parse(
    fs.readFileSync(path.join(__dirname, `../public/history.json`), "utf-8")
  );
  let new_his = req.body;
  new_his["date"] = today;
  histories.push(new_his);
  fs.writeFileSync(
    path.join(__dirname, "../public/history.json"),
    JSON.stringify(histories, null, "\t"),
    "utf-8"
  );
};
const recommend = (req, res) => {
  let allDog = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `../public/Animal/dog/dog.json`),
      "utf-8"
    )
  );
  let allCat = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `../public/Animal/cat/cat.json`),
      "utf-8"
    )
  );
  allDog.forEach((dog, idx) => {
    dog["image"] = `${baseUrl}/Animal/dog/${idx}.jpg`;
  });
  allCat.forEach((cat, idx) => {
    cat["image"] = `${baseUrl}/Animal/cat/${idx}.jpg`;
  });
  let animals = [...allDog, ...allCat];
  let result = [];
  for (let i = 0; i < 5; ++i) {
    let idx = Math.floor(Math.random() * animals.length);
    result.push(animals[idx]);
  }
  console.log(result);
  res.send({ data: result });
};
const countWeight = () => {};
const countScore = (total, history) => {
  let tags = {
    type: {},
    shape: {},
    gender: {},
    age: {},
    breed: {},
    color: {},
    date: {},
  };

  history.forEach((e, i) => {
    Object.keys(e).forEach((key) => {
      let v = e[key];
      "total" in tags[key] ? tags[key]["total"]++ : (tags[key]["total"] = 1);
      v in tags[key] ? tags[key][v]++ : (tags[key][v] = 1);
    });
  });
  Object.keys(tags).forEach((tag) => {
    Object.keys(tags[tag]).forEach((k) => {
      if (k !== "total") tags[tag][k] = tags[tag][k] / tags[tag]["total"];
    });
  });
  console.log(tags);
};
const findAnimal = (req, res) => {
  try {
    console.log(new Date().toLocaleDateString("zh-TW"));
    let history = fs.readFileSync(
      path.join(__dirname, `../public/history.json`),
      "utf-8"
    );
    history = JSON.parse(history);

    let type = req.body.type === "貓" ? "cat" : "dog";
    let animal = fs.readFileSync(
      path.join(__dirname, `../public/Animal/${type}/${type}.json`),
      "utf-8"
    );
    animal = JSON.parse(animal);
    let result = [...animal];
    result.forEach((r, idx) => {
      r["image"] = `${baseUrl}/Animal/${type}/${idx}.jpg`;
    });
    if (req.body.breed !== "不拘") {
      let date = new Date().toLocaleDateString("zh-TW");
      history.push({ breed: req.body.breed, date: date });
      result = result.filter((e) => {
        return e.breed === req.body.breed;
      });
    }
    if (req.body.gender !== "不拘")
      result = result.filter((e) => {
        return e.gender === req.body.gender;
      });
    res.send({ data: result });
    history = JSON.stringify(history, null, "\t");
    fs.writeFileSync(
      path.join(__dirname, "../public/history.json"),
      history,
      "utf-8"
    );
    console.log("success");
  } catch (error) {
    console.log(error);
  }
};
const getAllBreed = (req, res) => {
  try {
    let all_breed = fs.readFileSync(
      path.join(__dirname, "../public/Animal/type.json"),
      "utf-8"
    );
    all_breed = JSON.parse(all_breed);
    res.send({ data: all_breed });
  } catch (error) {}
};
module.exports = {
  createAnimal,
  recommend,
  findAnimal,
  getAllBreed,
  storeHistory,
};
