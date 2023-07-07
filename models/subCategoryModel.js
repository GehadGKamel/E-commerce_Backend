const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlenght: [2, "too short subCategory name"],
      maxlength: [32, "too long subCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belonng to parent category"],
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);
