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


function ProxyUserListController($scope, ProxyUser) {
    $scope.proxyusers = ProxyUser.query();

    $scope.remove = function (u) {
        u.$remove(function () {
            $location.path('/');
        });
    };
}

function ProxyUserNewController($scope, $location, ProxyUser) {
    $scope.proxyuser = new ProxyUser();
    $("#user_id").focus();

    // Make HTTP Request to get Image information

    $scope.save = function (user) {
        $scope.proxyuser.$save(function (user) {
            $location.path('/');
        });    
    };

    $scope.cancel = function () {
        $location.path('/');
    };
}

function ApiUserListController($scope, $location, ApiUser) {
    $scope.apiusers = ApiUser.query();

    $scope.remove = function (u) {
        u.$remove(function () {
            $location.path('/apiuser');
        });
    };
}

function ApiUserNewController($scope, $location, ApiUser) {
     $scope.apiuser = new ApiUser();

     $("#apiuser-id").focus();

    $scope.save = function (user) {
        $scope.apiuser.$save(function (user) {
            $location.path('/apiuser');
        });    
    };

    $scope.cancel = function () {
        $location.path('/apiuser');
    };    
}

function AdminUserChangePasswordController($scope, $http, $location) {
    $scope.user = {};
    $http.get('/adminuser/current').success(function(data, status, headers, config){
        $scope.user = data;
        console.log("User object: ",$scope.user);
    });

    $("#inputPw").focus();

    $scope.save = function (user) {
        delete user.password_conf;

        $http.post('/adminuser/current', user)
            .success(function () {
                $location.path('/');
            }).error(function () {
                $scope.message = "Problem Changing the Password";
            });
    };

    $scope.cancel = function () {
        $location.path('/');
    };

    // Check if passwords match
    $scope.passwordDontMatch = function (user) {
        return (user.password !== user.password_conf);
    };
}

