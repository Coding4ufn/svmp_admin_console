'use strict';

var mongoose = require('mongoose');
var config = require('../config/config').settings;
require('../models');

var AdminUser = mongoose.model('AdminUser');
var ProxyUser = mongoose.model('ProxyUser');
var ApiUser = mongoose.model('ApiUser');


mongoose.connect(config.db);

var default_admin = {username: 'mitre', password: 'mitre'};

var proxy_users = [
    {user_id: "1234", vm_id: "vm1234"},
    {user_id: "5678", vm_id: "vm5678"}
];

var api_users = [
    {name: "h1"}
];

function done(err) {
    if (err) {
        console.log("Error: ", err);
    }
    mongoose.disconnect(function () {
        console.log("Finished...shut down connection");
    });
}

AdminUser.create(default_admin, function (err, adminuser) {
    if (err) {
        done(err);
    } else {
        ProxyUser.create(proxy_users, function (err, puser) {
            if(err) done(err);
            else
                ApiUser.create(api_users, function(err, apiusers) {
                    if(err) done(err);
                    else
                        done();    
                });
        });
    }
});