'use strict';

var timeregApp = angular.module('timeregApp', ['timeregServices', 'chartServices']);

timeregApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}])

timeregApp.controller('TimeSheetCtrl', ['$scope', '$http', 'Timesheet', 'chartServices', function ($scope, $http, Timesheet, chartServices) {

  $scope.chartType = 'bar';
  $scope.displayDashboard = false;

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

  $scope.test = function() {
    $scope.username = testServices.testDisplay();
  }
  $scope.displayChart = function() {
   chartServices.createBarChart("chartArea", "test-unit");
   chartServices.createSpeedometerChart("workSpeedChartArea", 0, 16, 9.5, 9.5);
   chartServices.createSpeedometerChart("faktureringChartArea", 0, 100, 85, 85);
   $scope.displayDashboard = true;
  }

  $scope.toggleChartType = function() {
    console.log("chartType is " + $scope.chartType );
    if ($scope.chartType == 'bar') {
      $scope.chartType = 'pie';
      console.log("was bar, is pie");
    }
    else {
      $scope.chartType = 'bar';
      console.log("was whatever, is bar");
    }
 
    chartServices.clearChart("chartArea");

    if ($scope.chartType == 'pie') {
       chartServices.createPieChart("chartArea", "test-unit");
    }
    else {
       chartServices.createBarChart("chartArea", "test-unit");

    }
  }

}


]);
