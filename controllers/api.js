/*
 * Copyright 2013 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * author Dave Bryson
 *
 */
'use strict';
/**
 * CRUD Users API
 * @type {*}
 * @author Dave Bryson
 */
var mongoose = require('mongoose');
var ApiUser = mongoose.model('ApiUser');

/**
 * show all users
 * @param req
 * @param res
 */
exports.list = function (req, res) {
	ApiUser.find({}, function (err, users) {
        if (err) {
            res.status(500).send({ error: "Error listing Users" });
        } else {
            res.send(users);
        }
    });
};

exports.show = function (req, res) {
    ApiUser.findById(req.params.id, function (err, user) {
        if (err) {
            res.status(500).send({ error: "Error finding ProxyUser: " + req.params.id });
        } else {
            res.send(user);
        }
    });
};


/**
 * Add a new User. Failing on duplicates
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    var user = new ApiUser(req.body);
    user.save(function (err, newuser) {
        if (err) {
            // 11000 is dup record
            if (err.code === 11000) {
                res.status(500).send({ error: 'User already exists'});
            } else {
                res.status(500).send({ error: 'Error adding the user'});
            }
        } else {
            res.send(200);
        }
    });
};

/**
 * Delete a User for a given ID
 * @param req
 * @param res
 */
exports.remove = function (req, res) {
    ApiUser.findById(req.params.id, function (err, user) {
        user.remove();
        res.send(200);
    });
};


exports.authenticate = function (req, res) {

    var key = req.body.apikey;
    var userid  = req.body.userid;
    var password  = req.body.password;
    var secureId = req.body.secureid;

    /**
     * 1. Check valid API key
     * 2. authenticate with Radius
     * 3. Fetch and return proxy user info {ip: "", id: ""}
     */

    console.log("Got : ", req.body);
    res.status(200).send({ip: "555", id: "1000"});
    
    /*ApiUser.findOne({ apikey: key}, function (err, doc) {
        if( err ) {
            res.send(401);
        } else {
            var radius = radius.RadiusClient(config);
            radius.authenticate(userid,password,secureId, function(err, result ){
                if(err) {
                    res.send(400);
                } else {
                    if( result === 'ok') {}
                        ProxyUser.findOne({user_id: userid}, function (err, user) {
                            if( err ) {
                                res.send(404);
                            } else {
                                res.send(200);
                            }
                        });
                    } else {
                        res.send(401)
                    }
                }
            });
            
        }
    })*/
};
