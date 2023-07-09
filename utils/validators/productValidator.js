const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("too short product title")
    .notEmpty()
    .withMessage("product title required"),
  check("description")
    .notEmpty()
    .withMessage("product description required")
    .isLength({ max: 2000 })
    .withMessage("too long product description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity required")
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price required")
    .isNumeric()
    .withMessage("product price must be a number")
    .isLength({ max: 32 })
    .withMessage("too long product price"),
  check("priceAfterDiscount")
    .optional()
    .toFloat()
    .isNumeric()
    .withMessage("product priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price < value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("product colors must be an array of string"),
  check("imageCover").notEmpty().withMessage("product image cover required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("product images must be an array of string"),
  check("category")
    .notEmpty()
    .withMessage("product must belong to a category")
    .isMongoId()
    .withMessage("invalid Category id format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`no category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("subcaregories")
    .optional()
    .isMongoId()
    .withMessage("invalid Subcategory id format")
    .custom((subcategoriesIds) =>
      SubCategory.find({ _id: { $exists: true, $in: subcategoriesIds } }).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error("invalid Subcategories Ids"));
          }
        }
      )
    )
    .custom((val, { req }) =>
      SubCategory.find({ category: req.body.category }).then(
        (subcategories) => {
          const subCategoriesIdsInDB = [];
          subcategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoriesIdsInDB)) {
            return Promise.reject(
              new Error(`subcategories not belong to category`)
            );
          }
        }
      )
    ),
  check("brand").optional().isMongoId().withMessage("invalid Brand id format"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("ratingsAverage must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("ratingsAverage must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid Product id format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid Product id format"),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid Product id format"),
  validatorMiddleware,
];
