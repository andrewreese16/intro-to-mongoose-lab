const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const Crm = require("./models/model");

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  await runQueries();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit();
};

const runQueries = async () => {
  console.log("Queries running.");
};

connect();
