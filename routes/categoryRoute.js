const express = require('express');

const {getCategories} = require('../seervices/categoryService');

const router = express.Router();

router.get('/',getCategories);

module.exports = router;
