const mongoose = require("mongoose");
const connect_to_db = mongoose
  .connect("mongodb://localhost:27017/btpDB")
  .then(() => console.log("Connected"));

module.exports = connect_to_db;
