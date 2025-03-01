const mongoose = require("mongoose");
require("dotenv").config();

const mongodbConnection = mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

module.exports = mongodbConnection;
