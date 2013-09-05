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
var ProxyUser = mongoose.model('ProxyUser');
var Openstack = require('../lib/openstack');

/**
 * show all users
 * @param req
 * @param res
 */
exports.list = function (req, res) {
	ProxyUser.find({}, function (err, users) {
        if (err) {
            res.status(500).send({ error: "Error listing Users" });
        } else {
            console.log("sending proxy users");
            res.send(users);
        }
    });
};

exports.show = function (req, res) {
    ProxyUser.findById(req.params.id, function (err, user) {
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
    var user_id = req.body.user_id;
    var image_id = req.body.image_id;
    var flava = req.body.image_flavor;

    var user = new ProxyUser();
    user.user_id = user_id;

    var obj = {user_id: user_id, flavor: flava, image: image_id};
    Openstack.createVM(obj, function(err, r) {
        if(err) {
            console.log("Error: ", err);
            res.status(500).send({ error: 'Problem creating the VM'});
        } else {
            user.vm_id = r.id;
            user.vm_ip = r.ip;

            user.save(function (err, newuser) {
                if (err) {
                    // 11000 is dup record
                    if (err.code === 11000) {
                        res.status(500).send({ error: 'User already exists'});
                    } else {
                        console.log("ERROR ", err);
                        res.status(500).send({ error: 'Error adding the user'});
                    }
                } else {
                    res.send(200);
                }
            });
        }
    });
};

/**
 * Delete a User for a given ID
 * @param req
 * @param res
 */
exports.remove = function (req, res) {
    ProxyUser.findById(req.params.id, function (err, user) {
        user.remove();
        res.send(200);
    });
};

/**
 * return a list of images from openstack for select box
 */
exports.images = function (req, res) {
    Openstack.getImages(function(err,r) {
        if(err) {
            res.send(500);
        } else {
            res.send(r);
        }
    });
};