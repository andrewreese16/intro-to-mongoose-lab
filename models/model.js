// 1. Defining the Schema
// 2. Compliing the Model
// 3. Exporting the Model Object to be used in any file you want!

const mongoose = require("mongoose");

const crmSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Crm = mongoose.model("Crm", crmSchema);

module.exports = Crm;
