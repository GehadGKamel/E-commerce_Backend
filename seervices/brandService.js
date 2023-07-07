const slugify = require('slugify');
const asyncHamdler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const Brand = require('../models/brandModel');


//@desc get all Brands
//@route GET /api/v1/Brands
//@access Public
exports.getBrands = asyncHamdler(async (req, res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 0;
    const skip = (page - 1) * limit;

    const brands = await Brand.find({}).skip(skip).limit(limit);
    res.status(200).json({ result: brands.length, page, data: brands });
});

//@desc get specific brand by id
//@route GET /api/v1/brands/:id
//@access Public
exports.getBrand = asyncHamdler(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
       return next(new ApiError(`brand for this id ${id} not found`, 404));
    }
    res.status(200).json({ data: brand });
});

//@desc creat brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = asyncHamdler(async (req, res) => {
    const {name} = req.body;
    const brand = await Brand.create({ name, slug: slugify(name) });
    res.status(201).json({ data: brand });

});

//@desc update specific brand
//@route PUT /api/v1/brands/:id
//@access Private
exports.updateBrand = asyncHamdler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const brand = await Brand.findByIdAndUpdate({ _id: id }, { name, slug: slugify(name) }, { new: true });
    if (!brand) {
        return next(new ApiError(`brand for this id ${id} not found`, 404));
    }
    res.status(200).json({ data: brand });
});

////@desc delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private
exports.deleteBrand= asyncHamdler(async (req, res ,next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
        return next(new ApiError(`brand for this id ${id} not found`, 404));
    }
    res.status(200).send(brand);
});



