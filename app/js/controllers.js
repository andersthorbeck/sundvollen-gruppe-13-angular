'use strict';

var timeregApp = angular.module('timeregApp', ['timeregServices']);

timeregApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}])

function TimeSheetCtrl ($scope, $http, Timesheet) {
 
  $scope.logout = function(){
    console.log("Log off" + $scope.userid + " " + $scope.username)

    $scope.userid = '';
    $scope.username = '';
    $scope.userloggedin = false;
  }


  $scope.getTimelister = function(){
    console.log("hent timelister")
    $scope.entries = Timesheet.query({userId : $scope.userid});
    $scope.newEntry = {};
  }

  $scope.login = function () {

    console.log("logon: " + $scope.credentials.username + " " + $scope.credentials.password)

    $http.post('http://localhost:9090/dologin.json',  {username:$scope.credentials.username, password:$scope.credentials.password}, {withCredentials: true}).
    success(function(data, status, headers, config) {
        console.log("success")
        console.log(data)
        $scope.userid = data.bruker.id;
        $scope.userloggedin = true;
        $scope.username = data.bruker.navn
    }).
    error(function(data, status, headers, config) {
      console.log("error")
       console.log(data)
       console.log(status)
       console.log(headers)
       console.log(config)
    });

  };
}


timeregApp.controller('TimeSheetCtrl', ['$scope', '$http', 'Timesheet', TimeSheetCtrl]);
