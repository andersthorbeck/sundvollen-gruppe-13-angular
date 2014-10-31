'use strict';

var timeregServices = angular.module('timeregServices', ['ngResource']);

timeregServices.factory('Timesheet', ['$resource', function ($resource) {
  return $resource('http://localhost:9090/brukers/:userId/timelistes.json',{},{}, {withCredentials:true});
}]);

timeregServices.factory('TimesheetRows', ['$resource', function ($resource) {
  return $resource('http://localhost:9090/brukers/:userId/timelistes/:timelisteId.json',{},{'query':{isArray:false}}, {withCredentials:true});
}]);
