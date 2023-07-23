const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Category = require("../models/categoryModel");

//Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

//Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

  // save image into our db
  req.body.image = filename;
  
  next();
});

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
