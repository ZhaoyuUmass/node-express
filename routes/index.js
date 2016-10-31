var express = require('express');
var passport = require('passport');
var net = require('net');
var Account = require('../models/account');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var db_url = 'mongodb://localhost:27017/passport_local_mongoose_express4';

const noop_code = "function run(value, field, querier) {\n  return value;\n}";


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.post('/', function (req, res) {
    // console.log("Receive:"+req.user.username+" updates record "+req.body.record+" and code:\n"+req.body.code);
    var action = null,
        record = req.body.record,
        code = req.body.code,
        username = req.user.username;
    if(record.localeCompare("") == 0 && code.localeCompare("") != 0){
        res.send("Can not remove A record with code deployed, please remove your code first or remove both of them together.");
        return;
    }

    if(record.localeCompare("")==0){
        // delete means delete the record
        action = "delete";
    }else if (code.localeCompare("")==0){
        // remove means remove the code
        action = "remove";
    }else{
        action = "update";
    }

    // Fetch the record from db first
    MongoClient.connect(db_url, function(err, db){
        if(err){
            res.render('error', {
                message: err.message,
                error: err
            });
            db.close();
        }else {
            var collection = db.collection('users');

            collection.find({username:username}).toArray(function(err, results) {
                if(err){
                    res.render('error', {
                        message: err.message,
                        error: err
                    });
                    db.close();
                }else {
                    var guid = results[0].guid;
                    var toUpdate = true;
                    // now let's check whether it's necessary to update
                    if (action.localeCompare("update") == 0) {
                        var currentCode = results[0].code;
                        var currentRecord = results[0].record;
                        if (currentCode.localeCompare(code) == 0 && currentRecord.localeCompare(record) == 0) {
                            toUpdate = false;
                        }
                    }
                    if (action.localeCompare("remove") == 0){
                        var currentCode = results[0].code;
                        var currentRecord = results[0].record;
                        if(currentCode.localeCompare("") == 0 && currentRecord.localeCompare(record) == 0) {
                            toUpdate = false;
                        }else if(currentCode.localeCompare("") == 0 && currentRecord.localeCompare(record) != 0){
                            action = "update";
                        }
                    }
                    if (toUpdate) {
                        var json = {
                            action: action,
                            username: username,
                            guid: guid,
                            code: code,
                            record: record
                        };

                        console.log("Construct request:" + JSON.stringify(json));

                        sendRequestToProxy(json, function (data) {
                            if (data) {
                                console.log();
                                collection.update(
                                    {username: req.user.username},
                                    json
                                );
                                res.send(req.user.username + ".activegns.org successfully updated!");
                            } else {
                                res.send("Unable to update record for domain " + req.user.username + ".activegns.org");
                            }
                            db.close();
                        });
                    } else {
                        res.send("No record needs to be updated for " + req.user.username + ".activegns.org");
                    }
                }

            });

        }

    });

});

function sendRequestToProxy(json, next){

    var client = new net.Socket();
    client.connect(9090, '127.0.0.1', function () {
        client.write(JSON.stringify(json)+"\n");
        console.log('Connected:'+JSON.stringify(json));
    });

    client.on('data', function (data) {
        console.log('Received: ' + data);

        client.destroy(); // kill client after server's response
        next(JSON.parse(data));
    });
    /*
    client.on('close', function () {
        console.log('Connection closed');
        next(null);
    });
    */
}

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        }

        var json = { action:"create", username:req.body.username };
        sendRequestToProxy(json, function(data){
            if(data) {
                MongoClient.connect(db_url, function(err, db){
                    if(err){
                        return res.render('register', { error: "Cannot connect to db when creating this account."});
                    }else {
                        var collection = db.collection('users');
                        json.guid = data.guid;
                        // no code and no record for the domain
                        json.code = "";
                        json.record = "";
                        collection.insert([json], function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Inserted into the "users" collection. The documents inserted with "_id" are:', result);
                                passport.authenticate('local')(req, res, function () {
                                    req.session.save(function (err) {
                                        if (err) {
                                            return res.render('register', { error: "Wrong authentication when registered!"});
                                        }
                                        res.redirect('/');
                                    });
                                });
                            }
                        });
                    }

                    db.close();
                });

            } else {
                return res.render('register', { error: "Cannot create this account on GNS, please try later."});
            }

        });


    });
});



router.get('/login', function(req, res) {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: "The account doesn't exist or the password is incorrect" }), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
