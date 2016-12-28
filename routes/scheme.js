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
        default:
            resp.send("no such scheme");
            break;
    }
});

module.exports = router;