const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/userModel");

//Upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

//Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    // save image into our db
    req.body.profileImg = filename;
  }
  next();
});

//@desc get all users
//@route GET /api/v1/users
//@access private
exports.getUsers = factory.getAll(User);

//@desc get specific user by id
//@route GET /api/v1/users/:id
//@access private
exports.getUser = factory.getOne(User);

//@desc creat user
//@route POST /api/v1/users
//@access private
exports.createUser = factory.createOne(User);

//@desc update specific user
//@route PUT /api/v1/users/:id
//@access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`$No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`$No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

////@desc delete specific user
//@route DELETE /api/v1/users/:id
//@access Private
exports.deleteUser = factory.deleteOne(User, "user");
