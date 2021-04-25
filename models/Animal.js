const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AnimalSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  feature: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
});
const AnimalData = mongoose.model("animalData", AnimalSchema);
module.exports = AnimalData;
