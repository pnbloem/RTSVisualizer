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
	generatePlots(schedules);
});

function generatePlots(schedules){
	$("#schedules").empty();
	for(s in schedules){
		//Generate a schedule plot for each of the provided schedules.
		generatePlot(parseInt(s), schedules[s]);
	}
}


function generatePlot(s, schedule){
	$("#schedules").append("<div class='schedule_wrap' id='schedule_wrap_"+s+"'></div>");
	$("#schedule_wrap_"+s).append("<div class='schedule' id='schedule_"+s+"'></div>");
	$("#schedule_wrap_"+s).append("<div class='overview' id='overview_"+s+"'></div>");
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
	
	var options = {
		series: {
			lines: { show:true,
					 lineWidth: 10}
		},
		yaxis: {
			tickDecimals: 0
		},
		selection: {mode: "x"}
	};
	var plot = $.plot($("#schedule_" + s), points, options);
	var overview = $.plot($("#overview_"+s), points , {
		series: {
			lines: { show: true, lineWidth: 1 },
			shadowSize: 0
		},
		xaxis: { ticks: [], mode: "time" },
		yaxis: { ticks: [], min: 0, autoscaleMargin: 0.1 },
		colors: ["#12375C"],
		selection: { mode: "x", color:"#AAAAAA" }
	});
	$("#schedule_"+s).bind("plotselected", function(event, ranges){
		plot = $.plot($("#schedule_"+s), points,
			$.extend(true, {}, options, {
						  xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to }
					  }));		
		overview.setSelection(ranges,true);
	});
	$("#overview_"+s).bind("plotselected", function(event, ranges){
		plot.setSelection(ranges);
	});
}

function scheduleTasks(){
	var tasks = [];
	//console.log("Here");
	storeTasks(tasks);
	//console.log("Tasks stored.");
	generateSchedule(tasks);
}

function storeTasks(tasks){
	$("#tasklist").find(".task").each(function(){
		var id = $(this).attr('id');
		var name = $(this).find('#name_'+id).val();
		var wcet = $(this).find('#wcet_'+id).val();
		var start = $(this).find('#start_'+id).val();
		var period = $(this).find('#period_'+id).val();
		if((id == "") || (name == "") || (wcet == "") || (start == "") || (period == "")){
			alert("Please fill in all values.");
			return;
		}
		//alert("ID:" + id + " Name:" + name + " WCET:" + wcet + " Start:"+ start + " Period:" + period); 
		var task = {'id':id, 'name':name, 'wcet':parseInt(wcet), 'start':parseInt(start), 'period':parseInt(period)};
		tasks.push(task);
		//console.log(tasks);
	});
}

function generateSchedule(tasks){
	schedules = [];
	schedules.push(prioritySchedule(tasks));
	generatePlots(schedules);
}

function prioritySchedule(tasks){
	schedule = [];
	var currTime = 0;
	for(t in tasks){
		schedule.push([currTime, currTime + tasks[t]['wcet'], t]); 
		currTime += tasks[t]['wcet'];
	}
	console.log(schedule);
	return schedule;
}