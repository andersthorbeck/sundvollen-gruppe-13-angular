'use strict';

var minutesFilter = function() {
  return function(minutes) {
    if (typeof minutes !== "number") {
      return minutes;
    }
    var hours = Math.floor(minutes/60);
    var restMinutes = Math.round(minutes - (60 * hours));
    return hours + " timer " + restMinutes + " minutter";
  };
}


var timeregApp = angular.module('timeregApp', ['timeregServices']).filter('minutes', minutesFilter);

timeregApp.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}])

function TimeSheetCtrl ($scope, $http, Timesheet, TimesheetRows) {
 
  $scope.entries = []
  $scope.rows = []
  $scope.nyAktivitetRef = ""
  $scope.aktiviteter = []

  // Input as Date object
  var dateDiffMinutes = function(start, end) {
    // Date gjøres om til millisekunder siden epoch i arithmetisk operasjon
    return ((end - start)/1000)/60;
  }

  var avsluttSisteAktivitet = function(now) {
    if ($scope.aktiviteter.length > 0) {
      var forrigeAktivitet = $scope.aktiviteter[$scope.aktiviteter.length - 1];
      forrigeAktivitet['stopp'] = now;
      forrigeAktivitet['tid'] = dateDiffMinutes(forrigeAktivitet['start'], now);
    }
  }

  // Denne funksjonen er kun for debug purposes, for å unngå å måtte
  // vente i en time for å føre en time.
  var hastenTime = function(date) {
    return new Date(date.getTime() * 60);
  }

  var getNow = function() {
    return hastenTime(new Date);
  }

  $scope.logout = function(){
    console.log("Log off" + $scope.userid + " " + $scope.username)

    $scope.userid = '';
    $scope.username = '';
    $scope.userloggedin = false;
    $scope.entries = []
    $scope.rows = []
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

  $scope.getLastTimeliste = function(timelisteId) {
    console.log("getLastTimeliste")
    console.log("timelisteId: " + timelisteId)
    TimesheetRows.query({userId : $scope.userid, timelisteId: timelisteId}, function(timeliste) {
      console.log("Fikk rader: " + timeliste)
      var rader = timeliste['timeliste_rader']
      for (var i = 0; i < rader.length; i++) {
        if (!rader[i]['referanse']) {
          rader[i]['referanse'] = 'J-' + i;
        }
      };
      $scope.rows = timeliste['timeliste_rader']
    });
  }

  $scope.nyAktivitet = function() {
    var now = getNow();
    avsluttSisteAktivitet(now);
    var aktivitet = {'ref': $scope.nyAktivitetRef, 'start': now, 'stopp': 'in progress', 'tid': 'in progress'};
    $scope.aktiviteter.push(aktivitet);
    $scope.nyAktivitetRef = "";
  }

  $scope.avsluttDagen = function() {
    avsluttSisteAktivitet(getNow());
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


timeregApp.controller('TimeSheetCtrl', ['$scope', '$http', 'Timesheet', 'TimesheetRows', TimeSheetCtrl]);
