const factory = require("./handlersFactory");
const Product = require("../models/productModel");

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
