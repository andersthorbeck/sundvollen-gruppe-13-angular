'use strict';

var timeregApp = angular.module('timeregApp', ['timeregServices']);

timeregApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}])

function TimeSheetCtrl ($scope, $http, Timesheet, TimesheetRows) {
 
  $scope.entries = []
  $scope.rows = []

  $scope.logout = function(){
    console.log("Log off" + $scope.userid + " " + $scope.username)

    $scope.userid = '';
    $scope.username = '';
    $scope.userloggedin = false;
  }


  $scope.getTimelister = function(){
    console.log("hent timelister. userid: " + $scope.userid)
    $scope.entries = Timesheet.query({userId : $scope.userid}).$promise.then(function(data){
      console.log(data);
      $scope.getLastTimeliste(data[0]['id'])
    });
    console.log("$scope.entries: " + $scope.entries)
    $scope.newEntry = {};
  }

  //129
  $scope.getLastTimeliste = function(periodeId) {
    console.log("getLastTimeliste")
    //timelister = $scope.entries
    //$scope.getTimelister()
    //console.log("timelister: " + timelister)
//    if (timelister != null && timelister[0] != null) {
//      var periodeId = timelister[0]['periode_id'] // Antar siste timeliste er først i arrayen
      console.log("periodeId: " + periodeId)
      TimesheetRows.query({userId : $scope.userid, timelisteId: periodeId}, function(timeliste) {
        console.log("Fikk rader: " + timeliste)
        $scope.rows = timeliste['timeliste_rader']
      });
      //$scope.rows = timeliste['timeliste_rader']
      //console.log("rader: " + $scope.rows)
//    }
  }

/*
  $scope.$watch(
    function(scope) {return $scope.entries},
    function(newVal, oldVal) {
      console.log("entries has changed: " + $scope.entries)
      console.log("newVal: " + newVal + ", oldVal: " + oldVal)
      $scope.getLastTimeliste(oldVal)
    }
  );
*/

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


timeregApp.controller('TimeSheetCtrl', ['$scope', '$http', 'Timesheet', 'TimesheetRows', TimeSheetCtrl]);
