const express = require("express");
const mongoose = require("mongoose");
const createError = require("http-errors");
const dotenv = require("dotenv").config();

const app = express();

app.use(express.json()); // Request Content-Type: application/json
app.use(express.urlencoded({ extended: true })); // Request Content-Type: application/x-www-form-urlencoded

//Connecting to mongodb with mongoose
const URL = process.env.MONGODB_URI;

mongoose
  .connect(URL, {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log(error.message);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db...");
});

mongoose.connection.on("error", (error) => {
  console.log(error.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("mongoose connection is disconnected...");
});

process.on("SIGNIT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection is disconnected due to app termination");
    process.exit(0);
  });
});

app.use("/test", (req, res) => {
  //   res.send(req.query); // getting request queries
  //   res.send(req.params); // getting request parameters
  console.log(req.body);
  res.send(req.body);
});

const productRoute = require("./routes/products");
app.use("/products", productRoute);

app.use((req, res, next) => {
  //   const error = new Error("Not Found");
  //   err.status = 404;
  //   next(err);

  const error = createError(404, "Not Found");
  next(error);
});
//ERROR HANDLER
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server start on port " + PORT);
});
