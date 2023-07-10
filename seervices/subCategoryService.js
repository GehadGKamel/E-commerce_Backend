const slugify = require("slugify");
const asyncHamdler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

const SubCategory = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
//@desc creat subCategory
//@route POST /api/v1/subcategories
//@access Private
exports.createSubCategory = asyncHamdler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};
//@desc get all subcategories
//@route GET /api/v1/subcategories
//@access Public
exports.getSubCategories = asyncHamdler(async (req, res) => {
  //build query
  const documentsCounts = await SubCategory.countDocuments();
  const apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .paginate(documentsCounts)
    .filter()
    .search()
    .sort()
    .limitFields();

  // execute query
  const { mongooseQuery, paginationResult } = apiFeatures;
  const subCategories = await mongooseQuery;
  res.status(200).json({
    result: subCategories.length,
    paginationResult,
    data: subCategories,
  });
});

//@desc get specific subcategory by id
//@route GET /api/v1/subcategories/:id
//@access Public
exports.getSubCategory = asyncHamdler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategory.findById(id);
  // .populate({
  //   path: "category",
  //   select: "name",
  // });
  if (!subcategory) {
    return next(new ApiError(`SubCategory for this id ${id} not found`, 404));
  }
  res.status(200).json({ data: subcategory });
});

//@desc update specific subcategory
//@route PUT /api/v1/subcategories/:id
//@access Private
exports.updateSubCategory = asyncHamdler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subcategory = await SubCategory.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subcategory) {
    return next(new ApiError(`subCategory for this id ${id} not found`, 404));
  }
  res.status(200).json({ data: subcategory });
});

////@desc delete specific subcategory
//@route DELETE /api/v1/subcategories/:id
//@access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
