const express = require("express");
const Product = require("../models/Product.model");
const createError = require("http-errors");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const results = await Product.find({}, { __v: 0 });
    res.send(results);
  } catch (error) {
    console.log(error.message);
  }
});

//METHOD 1 (promises)
// router.post("/", (req, res, next) => {
//   console.log(req.body);
//   const product = new Product({
//     name: req.body.name,
//     price: req.body.price,
//   });
//   product
//     .save()
//     .then((result) => {
//       console.log("hello");
//       console.log("result is" + result);
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

//METHOD 2 (async & wait)
router.post("/", async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const result = await product.save();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await Product.findById(id); // Method 1
    // const result = await Product.findOne({ _id: id });   //  Method 2
    if (!result) {
      throw createError(404, "Product does not Exist");
    }
    res.send(result);
  } catch (error) {
    console.log(error.message);
    if (error instanceof mongoose.CastError) {
      next(createError(400, "Invalid Product Id"));
      return;
    }
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const result = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!result) {
      throw createError(404, "Product does not exist");
    }
    res.send(result);
  } catch (error) {
    console.log(error.message);
    if (error instanceof mongoose.CastError) {
      return next(createError(400, "Invalid product Id"));
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw createError(404, "Product does not Exist");
    }
    res.send(result);
  } catch (error) {
    console.log(error.message);
    if (error instanceof mongoose.CastError) {
      next(createError(400, "Invalid Product Id"));
      return;
    }
    next(error);
  }
});

module.exports = router;
