const mongoose = require('mongoose');

//1-create schema 
const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Brand required'],
        unique: [true, 'Brand must be unique'],
        minlength: [3, 'too short Brand name'],
        maxlength: [32, 'too long Brand name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
},
    { timestamps: true });

//2-create model
module.exports = mongoose.model('Brand', brandSchema);


