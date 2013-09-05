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
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

/**
 * User model for MongoDb
 * @type {Schema}
 */

var AdminUserSchema = new Schema({
    username: {type: String, unique: true, index: true, required: true},
    hashed_password: String,
    salt: String
});

// Helper to encrypt password in DB
AdminUserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
AdminUserSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next();
    }
    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});

/**
 * Methods
 */

AdminUserSchema.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function () {
        return Math.round((new Date().valueOf() * Math.random())) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function (password) {
        if (!password) {
            return '';
        }
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

var ProxyUserSchema = new Schema({
    user_id: {type: String, unique: true, index: true, required: true},
    vm_id: String, 
    vm_ip: String
});

var ApiUserSchema = new Schema({
    name: {type: String, unique: true, index: true, required: true},
    apikey: String
});

ApiUserSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next();
    }
    // Generate unique API key for new records
    var seed = crypto.randomBytes(20);
    this.apikey = crypto.createHash('sha1').update(seed).digest('hex');
    next();
});



var AdminUser = mongoose.model('AdminUser', AdminUserSchema);
var ProxyUser = mongoose.model('ProxyUser', ProxyUserSchema);
var ApiUser = mongoose.model('ApiUser', ApiUserSchema);






