const fs = require("fs");
const path = require("path");
const base = "https://ba7e2f98db77.ngrok.io";
let allCat = fs.readFileSync(
  path.join(__dirname, "public/Animal/cat/cat.json")
);
let allDog = fs.readFileSync(
  path.join(__dirname, "public/Animal/dog/dog.json")
);
let locations = fs.readFileSync(path.join(__dirname, "public/location2.json"));
let animal_type = { cat: ["不拘"], dog: ["不拘"] };
let animal_count = {};
let character = {};
let color = {};
let age = {};
let shape = {};
allCat = JSON.parse(allCat);
allDog = JSON.parse(allDog);
locations = JSON.parse(locations);
allCat.forEach((cat) => {
  if (!animal_type.cat.includes(cat.breed)) {
    animal_count[cat.breed] = 1;
    animal_type.cat.push(cat.breed);
  } else {
    ++animal_count[cat.breed];
  }
  if (!color[cat.color]) color[cat.color] = 1;
  else ++color[cat.color];

  if (!age[cat.age]) age[cat.age] = 1;
  else ++age[cat.age];

  if (!shape[cat.shape]) shape[cat.shape] = 1;
  else ++shape[cat.shape];
});
allDog.forEach((dog) => {
  if (!animal_type.dog.includes(dog.breed)) {
    animal_count[dog.breed] = 1;
    animal_type.dog.push(dog.breed);
  } else ++animal_count[dog.breed];

  if (!color[dog.color]) color[dog.color] = 1;
  else ++color[dog.color];

  if (!age[dog.age]) age[dog.age] = 1;
  else age[dog.age]++;

  if (!shape[dog.shape]) shape[dog.shape] = 1;
  else shape[dog.shape]++;
});
console.log(animal_count);
console.log(color);
console.log(age);
console.log(shape);
character["color"] = { ...color };
character["age"] = { ...age };
character["shape"] = { ...shape };
character["breed"] = { ...animal_count };
animal_type = JSON.stringify(animal_type, null, "\t");
character = JSON.stringify(character, null, "\t");
fs.writeFileSync(
  path.join(__dirname, "public/Animal/type.json"),
  animal_type,
  "utf-8"
);
fs.writeFileSync(
  path.join(__dirname, "public/Animal/character.json"),
  character,
  "utf-8"
);

let count = 0;
function randomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toLocaleDateString();
}

allDog.forEach((dog, idx) => {
  dog["date"] = randomDate(new Date(2017, 0, 1), new Date());
  dog["place"] = locations[count++];
  dog["image"] = `${base}/Animal/dog/${idx}.jpg`;
});
allCat.forEach((cat, idx) => {
  cat["date"] = randomDate(new Date(2012, 0, 1), new Date());
  cat["place"] = locations[count++];
  cat["image"] = `${base}/Animal/cat/${idx}.jpg`;
});
allDog = JSON.stringify(allDog, null, "\t");
allCat = JSON.stringify(allCat, null, "\t");
fs.writeFileSync(
  path.join(__dirname, "public/Animal/dog/dog.json"),
  allDog,
  "utf-8"
);
fs.writeFileSync(
  path.join(__dirname, "public/Animal/cat/cat.json"),
  allCat,
  "utf-8"
);
