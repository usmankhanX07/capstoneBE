var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    "name": "Task API Assignment",
    "version": "1.0",
    "endpoints": ["/api/items"] 
  });
});

router.get('/health', function(req, res, next) {
  res.json({"status":"ok"});
});

module.exports = router;
