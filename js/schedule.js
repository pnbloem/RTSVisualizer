//This is the .js file responsible for graphing the tasks.

/*
	Schedule format:
		Array with items for each contigious time-segment in the schedule
		along with what task is being executed during said time segment.
		For example:
			array[0] : {0, 10, 1}
			array[1] : {10, 12, 2}
			etc.
*/
//Declare some dummy schedules
var schedules = new Array();

var sched1 = new Array();
sched1[0] = new Array(0, 10, 0);
sched1[1] = new Array(10, 12, 1);
sched1[2] = new Array(12, 20, 2);

var sched2 = new Array();
sched2[0] = new Array(0, 1, 0);
sched2[1] = new Array(1, 15, 1);
sched2[2] = new Array(15, 20, 0);

schedules[0] = sched1;
schedules[1] = sched2;

$(function(){
	//This is where setup stuff should happen.
	$("#schedule_graphs").append("<div id='schedules'></div>");
});

function generatePlots(schedules){
	
}


function generatePlot(s, schedule){
	$("#schedules").append("<div class='schedule' id='schedule_" + s + "'></div>");
	var points = [];
	for(segment in schedule){
		var seg = schedule[segment];
		var segStart = seg[0];
		var segEnd = seg[1];
		var plotPt = [];
		if(points[seg[2]] == undefined){
			points[seg[2]] = new Array();
		}
		while (segStart <= segEnd){
			points[seg[2]].push([segStart, seg[2]]);
			plotPt = [];
			segStart++;
		}
		points[seg[2]].push(null);
	}
	console.log(points);
	var options = {
		series: {
			lines: { show:true,
					 lineWidth: 10}
		},
		yaxis: {
			ticks: [0, 1, 2, 3],
			tickDecimals: 0
		}
	};
	$.plot($("#schedule_" + s), points, options);
}	
