const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");

//@desc get all categories
//@route GET /api/v1/categories
//@access Public
exports.getCategories = factory.getAll(Category);

//@desc get specific category by id
//@route GET /api/v1/categories/:id
//@access Public
exports.getCategory = factory.getOne(Category);

//@desc creat category
//@route POST /api/v1/categories
//@access Private
exports.createCategory = factory.createOne(Category);

//@desc update specific category
//@route PUT /api/v1/categories/:id
//@access Private
exports.updateCategory = factory.updateOne(Category, "category");

////@desc delete specific category
//@route DELETE /api/v1/categories/:id
//@access Private
exports.deleteCategory = factory.deleteOne(Category, "category");
