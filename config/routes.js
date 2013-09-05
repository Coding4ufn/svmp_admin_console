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

var path = require('path');


function requiresAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', 'Login required with proper credentials');
        res.redirect('/login');
    }
}

/**
 * Application routes
 * @param app Express app
 */
module.exports = function (app, passport) {

    // Controllers
    var proxyuser = require('../controllers/proxyuser')
        , api = require('../controllers/api')
        , user = require('../controllers/users');


    // Login Form
    app.get('/login', function(req, res) {res.render('login', {message: req.flash('error')})});
    // Logout
    app.get('/logout', function (req, res) { req.logOut(); res.redirect('/login');});
    // Login in user and establish session. Invoked from Form POST
    app.post('/user/session', 
        passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid username or password.'}),
        function (req, res) {
            res.redirect('/');
        }
    );

    // Load the main page
    app.get('/', requiresAdmin, function (req, res) { res.render('index'); });
    
    /** ProxyUser endpoints */
    // List Proxy Users 
    app.get('/proxyuser', requiresAdmin, proxyuser.list);
    // Get a specific Proxyh User
    app.get('/proxyuser/:id', requiresAdmin, proxyuser.show);
    // Add proxy user
    app.post('/proxyuser', requiresAdmin, proxyuser.add);
    // Delete Proxy User
    app.delete('/proxyuser/:id', requiresAdmin, proxyuser.remove);

    /** API User enpoints */
    // List API Users
    app.get('/apiuser', requiresAdmin, api.list);
    // Get a specific API User
    app.get('/apiuser/:id', requiresAdmin, api.show);
    // Add API user
    app.post('/apiuser',  requiresAdmin, api.add);
    // Delete API user
    app.delete('/apiuser/:id', requiresAdmin, api.remove);
    // API Access from API clients
    app.post('/api/authenticate', api.authenticate); 


    /** Admin User endpoints */

    app.get('/adminuser/current', requiresAdmin, user.show);
    app.post('/adminuser/current', requiresAdmin, user.change_password);



    // Handle Errors
    app.use(function (err, req, res, next) {
        console.log("500: ", err);
        res.render('500');
    });

    app.use(function (req, res) {
        res.render('404', "Not Found");
    });
};