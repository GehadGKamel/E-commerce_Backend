const multer = require("multer");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiError = require("../utils/apiError");

const factory = require("./handlersFactory");
const Product = require("../models/productModel");

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only images are allowed", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.updateProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //1-image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);

    // save image into our db
    req.body.imageCover = imageCoverFilename;
  }
  //2-image prossessing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);

        // save image into our db
        req.body.images.push(imageName);
      })
    );
    next();
  }
});

//@desc get all products
//@route GET /api/v1/products
//@access Public
exports.getProducts = factory.getAll(Product, "product");

//@desc get specific product by id
//@route GET /api/v1/products/:id
//@access Public
exports.getProduct = factory.getOne(Product, "product");

//@desc creat product
//@route POST /api/v1/products
//@access Private
exports.createProduct = factory.createOne(Product, "product");

//@desc update specific product
//@route PUT /api/v1/products/:id
//@access Private
exports.updateProduct = factory.updateOne(Product, "product");

////@desc delete specific product
//@route DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = factory.deleteOne(Product, "product");
