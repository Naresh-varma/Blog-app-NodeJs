var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('AM I HERE ?');
  res.status(200).send('<h1>Express </h1>');
});

module.exports = router;
