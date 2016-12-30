/**
 * Created by gaozy on 12/28/16.
 */
var express = require('express');
var router = express.Router();

router.get('/:page', function(req, resp){
    var query = req.params.page;
    switch(query){
        case "myxdns":
            resp.render('myxdns');
            break;
        case "donar":
            resp.render('donar');
            break;
        case "nakika":
            resp.render('nakika');
            break;
        case "cost":
            resp.render('cost');
            break;
        default:
            resp.send('Page not found!');
            break;
    }
});

module.exports = router;