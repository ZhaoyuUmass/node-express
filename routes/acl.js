/**
 * Created by gaozy on 1/13/17.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, resp){
    var query = req.params.page;
    resp.render('acldemo');
});

module.exports = router;