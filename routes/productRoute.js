const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductImages,
  resizeProductImages,
} = require("../services/productService");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(
    updateProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    updateProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
