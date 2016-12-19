/**
 * Created by gaozy on 12/16/16.
 */
var express = require('express');
var router = express.Router();

router.get('/:page', function(req, resp){
    var query = req.params.page;
    switch(query){
        case "activecode":
            resp.render('activecode');
            break;
        case "activegns":
            resp.render('activegns');
            break;
        case "activequery":
            resp.render('activequery');
            break;
        default:
            resp.render('activegns');
            break;
    }
});

module.exports = router;