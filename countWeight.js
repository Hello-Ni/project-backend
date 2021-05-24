let fs = require("fs");
let path = require("path");
let allDog = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, `../backend/public/Animal/dog/dog.json`),
    "utf-8"
  )
);
let character = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, `../backend/public/Animal/character.json`),
    "utf-8"
  )
);
let allCat = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, `../backend/public/Animal/cat/cat.json`),
    "utf-8"
  )
);
let weight = {};
allDog.forEach((dog) => {
  if(breed in weight){
         
  }
}
