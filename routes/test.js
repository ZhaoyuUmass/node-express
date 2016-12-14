/**
 * Created by gaozy on 12/13/16.
 */
var express = require('express');
var router = express.Router();
const spawn = require('child_process').spawn;
const code = "function run(value, field, querier) {\n\
    return value;\n\
}";
const value = "{}"


router.get('/test', function(req, res){
    res.render('test');
});


router.post('/test', function(req, res){
    var code = req.code;

    const ls = spawn('java', ['-cp', 'debugger.jar', 'edu.umass.cs.activecode.ActiveRunner', code, value, value, ""]);

    ls.stdout.on('data', function(data) {
        console.log("stdout: "+data);
    });

    ls.stderr.on('data', function(data) {
        console.log("stderr:"+ data );
    });

    ls.on('close', function(code) {
        console.log("child process exited with code "+code)
    });
});


module.exports = router;