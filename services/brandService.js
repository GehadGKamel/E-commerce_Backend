const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");

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
