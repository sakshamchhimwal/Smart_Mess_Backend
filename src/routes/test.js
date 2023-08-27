
var express = require('express');
var router = express.Router();
const { addItem } = require("../controllers/test");

router.post('/', addItem);


module.exports = router;