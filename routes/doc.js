/**
 * Created by gaozy on 12/16/16.
 */
var express = require('express');
var router = express.Router();

router.get('/:page', function(req, resp){
    var query = req.params.page;
    switch(query){
        case "activecode":
            resp.render('doc/activecode');
            break;
        case "activegns":
            resp.render('doc/activepns');
            break;
        case "activequery":
            resp.render('doc/activequery');
            break;
        case "example":
            resp.render('doc/example');
            break;
        case "manageddns":
            resp.render('doc/manageddns');
            break;
        case "localnameserver":
            resp.render('doc/localnameserver');
            break;
        default:
            resp.render('doc/activepns');
            break;
    }
});

module.exports = router;