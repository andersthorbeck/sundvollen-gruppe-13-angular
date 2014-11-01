
var chartServices = angular.module('chartServices', ['ngResource']);

chartServices.factory('chartServices', ['$resource', function ($resource) {
    
        //Each bar represents a single discrete quantity.
    var exampleData =  [ 
                        {
                            key: "Serie 1",
                            values: [
                              { 
                                "label" : "Fakturerbart" ,
                                "value" : 130
                              } , 
                              { 
                                "label" : "Fagarbeid" , 
                                "value" : 27
                              } , 
                              { 
                                "label" : "Sykmeldt" , 
                                "value" : 1
                              } , 
                              { 
                                "label" : "Intern møte" , 
                                "value" : 6
                              } , 
                              { 
                                "label" : "Administrativt" ,
                                "value" : 2
                              }
                            ]
                          }
    ];

    var dataset = exampleData;

    var testMethod = function() {
    	return("test return value");
    }

    var testDisplay = function() {
        console.log("test!");
    }

    var createBarChart = function (domEltId, valuesUnit)
    {
        
        var height = 350;
        nv.addGraph(function() {
            var chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })    //Specify the data accessors.
            .y(function(d) { return d.value })
            .height(height)
            .staggerLabels(false)    //Too many bars and not enough room? Try staggering labels.
            .tooltips(true)        // show tooltips?
            .showValues(true)       //...instead, show the bar value right on top of each bar.
            .transitionDuration(350)
            ;
 
           chart.margin({bottom: 150, left: 100});
                chart.xAxis.rotateLabels(-45);
                                
           d3.select('#' + domEltId)
                .append("svg")
                .attr("id", "svgContainerId")
                .attr('height', height)
                .attr('width', 500)
                .datum(dataset)
                .call(chart);
 
           
            nv.utils.windowResize(chart.update);

            return chart;
        });
        
    }

    var createPieChart = function (domEltId, valuesUnit)
    {
        var height = 350;
        nv.addGraph(function() {
            var chart = nv.models.pieChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .height(height)
            .showLabels(false);
            
       d3.select('#' + domEltId)
            .append("svg")
            .attr("id", "svgContainerId")
            .attr('height', height)
            .attr('width', 350)
            .datum(dataset[0].values)
            .transition().duration(350)
            .call(chart);

        nv.utils.windowResize(chart.update);

        return chart;

        });
    }

    var clearChart = function(domEltId) {
        d3.select("#svgContainerId").remove();
    }

    var createSpeedometerChart = function(domEltId, min, max, speed, total) {
                var svg = d3.select('#' + domEltId)
                .append("svg:svg")
                .attr("width", 300)
                .attr("height", 300);


        var gauge = iopctrl.arcslider()
                .radius(120)
                .events(false)
                .indicator(iopctrl.defaultGaugeIndicator);
        gauge.axis().orient("in")
                .normalize(true)
                .ticks(12)
                .tickSubdivide(3)
                .tickSize(10, 8, 10)
                .tickPadding(5)
                .scale(d3.scale.linear()
                        .domain([min, max])
                        .range([-3*Math.PI/4, 3*Math.PI/4]));

        var segDisplay = iopctrl.segdisplay()
                .width(80)
                .digitCount(6)
                .negative(false)
                .decimals(1);

        svg.append("g")
                .attr("class", "segdisplay")
                .attr("transform", "translate(130, 200)")
                .call(segDisplay);

        svg.append("g")
                .attr("class", "gauge")
                .call(gauge);

        segDisplay.value(total);
        gauge.value(speed);

    }


    // Return our singleton object with all service methods
    return {
        createPieChart: createPieChart,
        createBarChart: createBarChart,
        createSpeedometerChart: createSpeedometerChart,
        clearChart: clearChart,
        testDisplay : testDisplay,
        testMethod: testMethod
    };

}]);
