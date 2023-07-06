const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Id is not valid'),
    validatorMiddleware
];

exports.createCategoryValidator = [
    check('name')
        .notEmpty()
        .withMessage('Category required')
        .isLength({ min: 3 })
        .withMessage('too short category name')
        .isLength({ max: 32 })
        .withMessage('too long category name'),
    validatorMiddleware,
];

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('invalid category id format'),
    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('invalid category id format'),
    validatorMiddleware,
];

