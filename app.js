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

var express = require('express'),
    //env = process.env.NODE_ENV || 'development',
    config = require('./config/config').settings,
    app = express(),
    mongoose = require('mongoose'),
    passport = require('passport');

// Setup db connection
mongoose.connect(config.db);

// Load model
require('./models');
// Load Passport
require('./config/passport')(passport, config);
// Setup Express
require('./config/express')(app, config, passport);
// Load the routes
require('./config/routes')(app, passport);

// Go
app.listen(config.port);
console.log('SVMP Admin Console running on port:' + config.port + '/');
