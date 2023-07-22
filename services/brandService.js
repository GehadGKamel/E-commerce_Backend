const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Brand = require("../models/brandModel");

//Upload single image
exports.uploadBrandImage = uploadSingleImage("image");

//Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  // save image into our db
  req.body.image = filename;
  next();
});

//@desc get all Brands
//@route GET /api/v1/Brands
//@access Public
exports.getBrands = factory.getAll(Brand);

//@desc get specific brand by id
//@route GET /api/v1/brands/:id
//@access Public
exports.getBrand = factory.getOne(Brand);
//@desc creat brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = factory.createOne(Brand);

//@desc update specific brand
//@route PUT /api/v1/brands/:id
//@access Private
exports.updateBrand = factory.updateOne(Brand, "brand");

////@desc delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private
exports.deleteBrand = factory.deleteOne(Brand, "brand");
