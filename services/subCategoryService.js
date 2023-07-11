const factory = require("./handlersFactory");
const SubCategory = require("../models/subCategoryModel");

exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

//@desc get all subcategories
//@route GET /api/v1/subcategories
//@access Public
exports.getSubCategories = factory.getAll(SubCategory);

//@desc get specific subcategory by id
//@route GET /api/v1/subcategories/:id
//@access Public
exports.getSubCategory = factory.getOne(SubCategory);

//@desc creat subCategory
//@route POST /api/v1/subcategories
//@access Private
exports.createSubCategory = factory.createOne(SubCategory);

//@desc update specific subcategory
//@route PUT /api/v1/subcategories/:id
//@access Private
exports.updateSubCategory = factory.updateOne(SubCategory, "subCategory");

////@desc delete specific subcategory
//@route DELETE /api/v1/subcategories/:id
//@access Private
exports.deleteSubCategory = factory.deleteOne(SubCategory, "subCategory");
