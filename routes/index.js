var express = require('express');
var passport = require('passport');
var net = require('net');
var Account = require('../models/account');
var router = express.Router();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var db_url = 'mongodb://localhost:27017/passport_local_mongoose_express4';

const UPDATE_CODE = "update_code",
    UPDATE_RECORD = "update_record",
    REMOVE_CODE = "remove_code",
    DELETE_RECORD = "delete_record";

const LOGIN = 'basic/login',
    REGISTER = 'basic/register',
    INDEX = 'basic/index',
    ERROR = 'template/error';

router.get('/', function (req, res) {
    var user = req.user;
    if(user){
        var username = user.username;
        MongoClient.connect(db_url, function(err, db){
            if(err){
                return res.render(ERROR, { error: "Cannot connect to db when fetching data."});
            }else {
                var collection = db.collection('users');
                collection.find({username: username}).toArray(function(err, results) {
                    if(err){
                        res.render(ERROR, {
                            message: err.message,
                            error: err
                        });
                    }else{
                        var code = results[0].code;
                        var record = results[0].record;
                        var json = {
                            user: req.user,
                            code: code,
                            record: record
                        };
                        res.render(INDEX, json);
                    }
                });
                db.close();
            }
        });
    }else {
        res.render(INDEX, { user : req.user });
    }
});

router.post('/', function (req, res) {
    var query = req.body.action,
        username = req.user.username,
        action = null,
        record = req.body.record,
        code = req.body.code;

    // Fetch the record from db first
    MongoClient.connect(db_url, function(err, db){
        if(err){
            res.render(ERROR, {
                message: err.message,
                error: err
            });
            db.close();
        }else {
            var collection = db.collection('users');

            collection.find({username:username}).toArray(function(err, results) {
                if(err){
                    res.render(ERROR, {
                        message: err.message,
                        error: err
                    });
                    db.close();
                }else {
                    var guid = results[0].guid;
                    var currentCode = results[0].code;
                    var currentRecord = results[0].record;
                    var toUpdate = true;

                    // now let's check whether it's necessary to update
                    switch(query) {
                        case "code":
                            // currentCode != code, then it needs to update
                            record = currentRecord;
                            if (currentCode.localeCompare(code) != 0) {
                                if (code.localeCompare("") == 0) {
                                    action = REMOVE_CODE;
                                } else {
                                    action = UPDATE_CODE;
                                }
                            } else {
                                toUpdate = false;
                            }
                            break;
                        case "record":
                            code = currentCode;
                            if (currentRecord.localeCompare(record) != 0) {
                                if (record.localeCompare("") == 0) {
                                    action = DELETE_RECORD;
                                } else {
                                    action = UPDATE_RECORD;
                                }
                            } else{
                                toUpdate = false;
                            }
                            break;
                        default:
                            break;
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
                        res.send("No need to update for " + req.user.username + ".activegns.org");
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
}

router.get('/register', function(req, res) {
    res.render(REGISTER, { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render(REGISTER, { error : err.message });
        }

        var json = { action:"create", username:req.body.username };

        sendRequestToProxy(json, function(data){
            if(data) {
                MongoClient.connect(db_url, function(err, db){
                    if(err){
                        return res.render(REGISTER, { error: "Cannot connect to db when creating this account."});
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
                                            return res.render(REGISTER, { error: "Wrong authentication when registered!"});
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
                return res.render(REGISTER, { error: "Cannot create this account on GNS, please try later."});
            }

        });


    });
});



router.get('/login', function(req, res) {
    res.render(LOGIN, { user : req.user, error : req.flash(ERROR)});
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
