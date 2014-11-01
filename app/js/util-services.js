

// service for utility code which can be med directly available to controllers and views
angular.module('utilServices', ['ngResource'])
    .factory('utilService', [ 'ENV', function(ENV){

 
    	var isEmpty = function(value) {
    		if ( typeof value == "undefined" || value == "" ) {
    			return true;
	   	}
    		else {
    			return false;
	   	}
    	}
    	
    	//********************   Date related services   ***************************
    	//************************************************************************
    	
    	// return duration for display as days, hours, minutes
	var displayDurationDHM = function(durationInMs) {
		var minutes = Math.floor( durationInMs / (60 * 1000) );
		var hours = Math.floor(minutes / 60);
		minutes -= hours * 60;
		var days = Math.floor(hours/24);
		hours -= days *24;
		var displayDuration ="";
   		if (days > 0) { 
				displayDuration += days + " dager ";
			}
   		if (hours > 0) { 
			displayDuration += hours + " timer ";
		}
   		if (minutes > 0) { 
			displayDuration += minutes + " min ";
		}
   		return displayDuration;
	}
	
	var durationInHours = function(durationInMs) {
		return Math.floor(durationInMs / 1000 / 60 / 60);
	}
    	
	var formatDate = function(date, format) {
		var formatedDate = "";
		if (!isEmpty(date)) {
			switch(format) {
			case "dd.mm.yyyy":
				var twoDigitMonth=((date.getMonth()+1)>=10)? (date.getMonth()+1) : '0' + (date.getMonth()+1);  
				var twoDigitDay =((date.getDay())>=10)? (date.getDay()) : '0' + (date.getDay());
				formatedDate = twoDigitDay+ "." + twoDigitMonth + "." + date.getFullYear()  ;
				break;
			case "mm.yyyy":
				var twoDigitMonth=((date.getMonth()+1)>=10)? (date.getMonth()+1) : '0' + (date.getMonth()+1);  
				var twoDigitDay =((date.getDay())>=10)? (date.getDay()) : '0' + (date.getDay());
				formatedDate = twoDigitMonth + "." + date.getFullYear()  ;
				break;
			default:
				console.log("WARNING:  unexpected date format, returning default dd.mm.yyyy");
				formatDate(date, "dd.mm.yyyy");
				break;
			}
		}
		return formatedDate;
	}
    	
    // TODO: review to take into account all months involved even if just by a single day
    // counts all months involved, event those which are not fully ellapsed
    var monthDiff = function(d1, d2) {
    		var months;
    		months = (d2.getFullYear() - d1.getFullYear()) * 12;
    		months -= d1.getMonth();
    		months += d2.getMonth() + 1;
    		return months <= 0 ? 0 : months;
    };

    	
    // Return our singleton object with all service methods
    	return {
    		isEmpty: isEmpty,
    		displayDurationDHM: displayDurationDHM,
    		formatDate: formatDate,
    		monthDiff: monthDiff,
    		durationInHours: durationInHours
    	};

}]);

