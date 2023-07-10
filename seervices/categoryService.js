const slugify = require("slugify");
const asyncHamdler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

const Category = require("../models/categoryModel");

//@desc get all categories
//@route GET /api/v1/categories
//@access Public
exports.getCategories = asyncHamdler(async (req, res) => {
  //build query
  const documentsCounts = await Category.countDocuments();
  const apiFeatures = new ApiFeatures(Category.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .sort()
    .limitFields();

  // execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const categories = await mongooseQuery;
  res
    .status(200)
    .json({ result: categories.length, paginationResult, data: categories });
});

//@desc get specific category by id
//@route GET /api/v1/categories/:id
//@access Public
exports.getCategory = asyncHamdler(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ApiError(`Category for this id ${id} not found`, 404));
  }
  res.status(200).json({ data: category });
});

//@desc creat category
//@route POST /api/v1/categories
//@access Private
exports.createCategory = asyncHamdler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

//@desc update specific category
//@route PUT /api/v1/categories/:id
//@access Private
exports.updateCategory = asyncHamdler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`Category for this id ${id} not found`, 404));
  }
  res.status(200).json({ data: category });
});

////@desc delete specific category
//@route DELETE /api/v1/categories/:id
//@access Private
exports.deleteCategory = factory.deleteOne(Category);
