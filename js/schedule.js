//This is the .js file responsible for graphing the tasks.

/*
	Schedule format:
		Array with items for each contigious time-segment in the schedule
		along with what task is being executed during said time segment.
		For example:
			array[0] : {0, 10, Task1}
			array[1] : {10, 12, Task2}
			etc.
*/
//Declare some dummy schedules
var schedules = new Array();

var sched1 = new Array();
sched1[0] = new Array(0, 10, "T1");
sched1[1] = new Array(10, 12, "T2");
sched1[2] = new Array(12, 20, "T3");

var sched2 = new Array();
sched2[0] = new Array(0, 10, "T1");
sched2[1] = new Array(10, 12, "T2");
sched2[2] = new Array(12, 20, "T3");

schedules[0] = sched1;
schedules[1] = sched2;

$(function(){
	$("#schedule_graphs").append("<div id='schedules'></div>");
	//This is where setup stuff should happen.
	for(s in schedules){
		//Generate a schedule plot for each of the provided schedules.
		generatePlot(s, schedules[s])
	}
});

function generatePlot(s, schedule){
	$("#schedules").append("<div class='schedule' id='schedule_" + s + "'></div>");
	var points = [];
	for(segment in schedule){
		var seg = schedule[segment];
		var segStart = seg[0];
		var segEnd = seg[1];
		while (segStart <= segEnd){
			
		}
	}
}
