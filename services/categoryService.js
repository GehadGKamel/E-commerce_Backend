const multer = require("multer");
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");
const ApiError = require("../utils/apiError");

//Disk storage engine
// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/categories");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.mimetype.split("/")[1];
//     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
//     cb(null, filename);
//   },
// });

//2- Memory storage engine
const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadCategoryImage = upload.single("image");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);

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
