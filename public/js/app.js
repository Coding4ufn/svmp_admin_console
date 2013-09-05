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

angular.module('svmp', ['svmp.services']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/templates/proxyuser/index.html',
            controller: ProxyUserListController
        })
        .when('/proxyuser/new', {
            templateUrl: '/templates/proxyuser/new.html',
            controller: ProxyUserNewController   
        })
        .when('/apiuser', {
            templateUrl: '/templates/apiuser/index.html',
            controller: ApiUserListController    
        })
        .when('/apiuser/new', {
            templateUrl: '/templates/apiuser/new.html',
            controller: ApiUserNewController   
        })
        .when('/admin/update', {
            templateUrl: 'templates/users/change_password.html',
            controller:  AdminUserChangePasswordController
        })
        .otherwise({
            redirectTo: '/'
        });
}]);



