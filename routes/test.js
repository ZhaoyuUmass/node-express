/**
 * Created by gaozy on 12/13/16.
 */
var express = require('express');
var router = express.Router();
const spawn = require('child_process').spawn;

router.get('/', function(req, resp){
    resp.render('test');
});


router.post('/', function(req, resp){
    var code = req.body.code;
    var value = req.body.value;
    var qvalue = req.body.qvalue;
    var accessor = req.body.accessor;
    console.log("code:"+code+",value:"+value+",qvalue:"+qvalue+",accessor:"+accessor);
    var err = "";
    var result = "";

    var proc = spawn('java', ['-cp', 'debugger.jar', 'edu.umass.cs.activecode.ActiveRunner', code, value, qvalue, accessor]);

    proc.stdout.on('data', function(data) {
        console.log(data+"");
        result = result.concat(data);
    });

    proc.stderr.on('data', function(data) {
        console.log(data+"");
        err = err.concat(data);
    });

    proc.on('close', function(code) {
        if(err.localeCompare("") == 0){
            var arr = result.split("\n");
            value = arr[0];
            qvalue = arr[1];
            var json = JSON.stringify({err:err, value:value, qvalue:qvalue});
            resp.status(200).send(json)
        }else{
            var json = JSON.stringify({err:err, value:value, qvalue:qvalue});
            resp.status(200).send(json);
        }
    });

});

module.exports = router;