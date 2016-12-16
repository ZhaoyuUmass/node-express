/**
 * Created by gaozy on 12/16/16.
 */
/**
 * Created by gaozy on 12/13/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, resp){
    var query = req.query;
    switch(query){
        case "":
            break;
        case "":
            break;
        default:
            break;
    }
    resp.render('active_code_document');
});

module.exports = router;