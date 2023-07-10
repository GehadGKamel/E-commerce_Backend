const slugify = require("slugify");
const asyncHamdler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const Product = require("../models/productModel");

//@desc get all products
//@route GET /api/v1/products
//@access Public
exports.getProducts = asyncHamdler(async (req, res) => {
  //1) filtering
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const queryStringObj = { ...req.query };
  const excludesFields = ["page", "sort", "limit", "fields"];
  excludesFields.forEach((field) => delete queryStringObj[field]);

  //apply filteration using [gte, gt, lte, lt]
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //2) pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  //build query
  const mongooseQuery = Product.find(JSON.parse(queryStr))
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name" });

  // execute query
  const products = await mongooseQuery;

  res.status(200).json({ result: products.length, page, data: products });
});

//@desc get specific product by id
//@route GET /api/v1/products/:id
//@access Public
exports.getProduct = asyncHamdler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: "category",
    select: "name",
  });
  if (!product) {
    return next(new ApiError(`product for this id ${id} not found`, 404));
  }
  res.status(200).json({ data: product });
});

//@desc creat product
//@route POST /api/v1/products
//@access Private
exports.createProduct = asyncHamdler(async (req, res) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

//@desc update specific product
//@route PUT /api/v1/products/:id
//@access Private
exports.updateProduct = asyncHamdler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const product = await Product.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!product) {
    return next(new ApiError(`product for this id ${id} not found`, 404));
  }
  res.status(200).json({ data: product });
});

////@desc delete specific product
//@route DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = asyncHamdler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    return next(new ApiError(`Product for this id ${id} not found`, 404));
  }
  res.status(200).send(product);
});
