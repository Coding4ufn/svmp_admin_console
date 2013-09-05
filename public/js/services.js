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

var services = angular.module('svmp.services', ['ngResource']);

services.factory('ProxyUser', ['$resource', function ($resource) {
    return $resource('/proxyuser/:id', {id: '@_id'});
}]);

services.factory('ApiUser', ['$resource', function ($resource) {
    return $resource('/apiuser/:id', {id: '@_id'});
}]);
