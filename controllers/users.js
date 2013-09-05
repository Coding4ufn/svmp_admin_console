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
var AdminUser = mongoose.model('AdminUser');




/**
 * Get a AdminUser be ID
 * @param req
 * @param res
 */
exports.show = function (req, res) {
    var safeObject = {username: req.user.username, _id: req.user._id};
    res.send(safeObject);
};


/**
 * Change an existing user's password
 * @param req
 * @param res
 */
exports.change_password = function (req, res) {
    AdminUser.findById(req.body._id, function (err, user) {
        if (user) {
            user.password = req.body.password;
            user.save();
            res.send(200);
        } else {
            res.status(500).send({ error: "Error finding User: " + req.body.username});
        }
    });
};

