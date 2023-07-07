const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Id is not valid'),
    validatorMiddleware
];

exports.createBrandValidator = [
    check('name')
        .notEmpty()
        .withMessage('Brand required')
        .isLength({ min: 3 })
        .withMessage('too short Brand name')
        .isLength({ max: 32 })
        .withMessage('too long Brand name'),
    validatorMiddleware,
];

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('invalid Brand id format'),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('invalid Brand id format'),
    validatorMiddleware,
];

