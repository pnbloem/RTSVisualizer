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
var simLen;

$(function(){
	//This is where setup stuff should happen.
	$("#schedule_graphs").append("<div id='schedules'>Add some tasks and click 'Create Schedule'\
	to give it a try!</div>");
	 
});

function generatePlots(schedules){
	$("#schedules").empty();
	for(s in schedules){
		//Generate a schedule plot for each of the provided schedules.
		if(schedules[s]['schedulable']){
			generatePlot(parseInt(s), schedules[s]);
		} else {
			generateErrorDiv(schedules[s]['name']);
		}
	}
}

function generateErrorDiv(name){
	$("#schedules").append("<div class='schedule_wrap' id='schedule_wrap_"+s+"'></div>");
	$("#schedule_wrap_"+s).append("<div class='schedule_name' id='sched_name_"+s+"'>"+name+"</div>");	
	$("#schedule_wrap_"+s).append("<div class='schedule_error' id='schedule_"+s+"'>Not schedulable\
	using this algorithm.</div>");
}

function generatePlot(s, schedule){
	$("#schedules").append("<div class='schedule_wrap' id='schedule_wrap_"+s+"'></div>");
	$("#schedule_wrap_"+s).append("<div class='schedule_name' id='sched_name_"+s+"'>"+schedule['name']+"</div>");	
	$("#schedule_wrap_"+s).append("<div class='schedule' id='schedule_"+s+"'></div>");
	$("#schedule_wrap_"+s).append("<div class='overview' id='overview_"+s+"'></div>");
	var points = [];
	for(segment in schedule['timing']){
		var seg = schedule['timing'][segment];
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
		xaxis: {
			min: 0,
			max: simLen
		},
		selection: {mode: "x"}
	};
	var plot = $.plot($("#schedule_" + s), points, options);
	var overview = $.plot($("#overview_"+s), points , {
		series: {
			lines: { show: true, lineWidth: 1 },
			shadowSize: 0
		},
		xaxis: { ticks: [], mode: "time", min: 0, max: simLen },
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
	storeTasks(tasks);
	generateSchedule(tasks);
}

function storeTasks(tasks){
	var taskId = 1;
	$("#tasklist").find(".task").each(function(){
		var id = taskId;
		taskId++;
		var name = $(this).find('.name').val();
		alert(name);
		var wcet = $(this).find('.wcet').val();
		alert(wcet);
		var start = $(this).find('.start').val();
		alert(start);
		var period = $(this).find('.period').val();
		alert(period);
		if((id == "") || (name == "") || (wcet == "") || (start == "") || (period == "")){
			alert("Please fill in all values.");
			return;
		}
		//alert("ID:" + id + " Name:" + name + " WCET:" + wcet + " Start:"+ start + " Period:" + period); 
		var task = {'id':id, 'name':name, 'wcet':parseInt(wcet), 'start':parseInt(start), 'period':parseInt(period)};
		tasks.push(task);
	});
}

function generateSchedule(tasks){
	schedules = [];
	simLen = 2*periodLCM(tasks);
	//schedules.push(nonSchedule(tasks));
	schedules.push(rmSchedule(tasks, simLen));
	schedules.push(minLaxSchedule(tasks, simLen));
	schedules.push(nearCompletion(tasks, simLen));
	schedules.push(edfSchedule(tasks, simLen));
	//ADD MORE SCHEDULING ALGORITHMS HERE
	generatePlots(schedules);
}

function nonSchedule(tasks){
	var schedule = [];
	var currTime = 0;
	for(t in tasks){
		schedule.push([currTime, currTime + tasks[t]['wcet'], t]); 
		currTime += tasks[t]['wcet'];
	}
	return schedule;
}

function rmSchedule(tasks, simLen){
	var schedule = new Array();
	schedule['name'] = "Rate Monotonic";
	schedule['schedulable'] = true;
	schedule['timing'] = [];
	
	var remainingExecutionTime = new Array();
	var schedulable = new Array();
	for(t in tasks){
		remainingExecutionTime.push(0);
		schedulable.push(false);
	}
	var timeSegment = [null, null, null];
	for(var i = 0; i < simLen; i++){
		//If a multiple of task period, replenish remaining execution time
		for(t in tasks){
			if((i % tasks[t]['period']) == tasks[t]['start']){
				if(remainingExecutionTime[t] != 0){
					schedule['schedulable'] = false;
					return schedule;
				}
				remainingExecutionTime[t] = tasks[t]['wcet'];
			}
		}
	
		//Determine which task executes during each time unit.
		var taskToRun = null;
		var taskToRunPeriod = null;
		for(t in tasks){
			if(remainingExecutionTime[t] != 0){
				if(taskToRunPeriod == null){
					taskToRun = t;
					taskToRunPeriod = tasks[t]['period'];
				} else if(tasks[t]['period'] < taskToRunPeriod){
					taskToRun = t;
					taskToRunPeriod = tasks[t]['period'];
				}
			}
		}
		//Decrement remaining execution time
		if(taskToRun != null){
			remainingExecutionTime[taskToRun]--;
			
			if(taskToRun == timeSegment[2]){
				timeSegment[1]++;
			} else {
				if(timeSegment[0] != null){
					schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
				}
				timeSegment[0] = i;
				timeSegment[1] = i+1;
				timeSegment[2] = taskToRun;
			}
		} else {
			schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
			timeSegment = [null, null, null];
		}
	}	
	schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
	return schedule;
}

function minLaxSchedule(tasks, simLen){
	var schedule = new Array();
	schedule['name'] = "Minimum Laxity First";
	schedule['schedulable'] = true;
	schedule['timing'] = [];
	
	var remainingExecutionTime = new Array();
	var schedulable = new Array();
	for(t in tasks){
		remainingExecutionTime.push(0);
		schedulable.push(false);
	}
	var timeSegment = [null, null, null];
	for(var i = 0; i < simLen; i++){		
		for(t in tasks){
			if((i % tasks[t]['period']) == tasks[t]['start']){
				if(remainingExecutionTime[t] != 0){
					schedule['schedulable'] = false;
					return schedule;
				}
				remainingExecutionTime[t] = tasks[t]['wcet'];
			}
		}
		
		//Determine which task executes during each time unit.
		/*
		 * This is where the choice to run one task over another is made
		 * at any given point in time (i). To do this, choose the variable
		 * you're making the decision on (in this case, taskToRunLaxity).
		 * Then, in the if(taskToRunLaxity == null) statement, set the 
		 * value (This will give a baseline task that will run. If no
		 * tasks have execution time yet, taskToRun remains null, and
		 * the schedule appropriately has a gap.), and the taskToRun.
		 *
		 * In the else if statement, check if the current task you're
		 * checking should have higher priority. In this case, whether
		 * the laxity is less than the minimum laxity found thus far.
		 * If the task should have higher priority, replace taskToRun
		 * and the decision variable with those from the new task.
		 *
		 * That's it! Everything else is taken care of!
  		 */
		var taskToRun = null;
		var taskToRunLaxity = null;
		for(t in tasks){
			if(remainingExecutionTime[t] != 0){
				if(taskToRunLaxity == null){
					taskToRun = t;
					taskToRunLaxity = ((i - tasks[t]['start']) % tasks[t]['period']) - remainingExecutionTime[t];
				} else if((((i - tasks[t]['start']) % tasks[t]['period']) - remainingExecutionTime[t]) < taskToRunLaxity){
					taskToRun = t;
					taskToRunLaxity = ((i - tasks[t]['start']) % tasks[t]['period']) - remainingExecutionTime[t];
				}
			}
		}
		//Decrement remaining execution time
		if(taskToRun != null){
			remainingExecutionTime[taskToRun]--;
			if(remainingExecutionTime[taskToRun] == 0){
				schedulable[taskToRun] = true;
			}
			
			if(taskToRun == timeSegment[2]){
				timeSegment[1]++;
			} else {
				if(timeSegment[0] != null){
					schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
				}
				timeSegment[0] = i;
				timeSegment[1] = i+1;
				timeSegment[2] = taskToRun;	
			}
		}  else {
			schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
			timeSegment = [null, null, null];
		}
	}	
	schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
	return schedule;
}

// Zach did this, so blame him when it fucks up!
// TIME TO COMPLETION
function nearCompletion(tasks, simLen){
	var schedule = new Array();
	schedule['name'] = "Nearest Time to Completion";
	schedule['schedulable'] = true;
	schedule['timing'] = [];
	
	var remainingExecutionTime = new Array();
	var schedulable = new Array();
	for(t in tasks){
		remainingExecutionTime.push(0);
		schedulable.push(false);
	}
	var timeSegment = [null, null, null];
	
	for(var i = 0; i < simLen; i++){		
		for(t in tasks){
			if((i % tasks[t]['period']) == tasks[t]['start']){
				if(remainingExecutionTime[t] != 0){
					schedule['schedulable'] = false;
					return schedule;
				}
				remainingExecutionTime[t] = tasks[t]['wcet'];
			}
		}
		
		//Determine which task executes during each time unit.
		/*
		 * This is where the choice to run one task over another is made
		 * at any given point in time (i). To do this, choose the variable
		 * you're making the decision on (in this case, taskToRunLaxity).
		 * Then, in the if(taskToRunLaxity == null) statement, set the 
		 * value (This will give a baseline task that will run. If no
		 * tasks have execution time yet, taskToRun remains null, and
		 * the schedule appropriately has a gap.), and the taskToRun.
		 *
		 * In the else if statement, check if the current task you're
		 * checking should have higher priority. In this case, whether
		 * the laxity is less than the minimum laxity found thus far.
		 * If the task should have higher priority, replace taskToRun
		 * and the decision variable with those from the new task.
		 *
		 * That's it! Everything else is taken care of!
  		 */
//CHANGES START HERE
		// NEAREST TIME TO COMPLETION
		// 
		
		var taskToRun = null;
		var timeToComplete = null; //new
		for(t in tasks){							// for each task
			if(remainingExecutionTime[t] != 0){		//if it isn't done running
				
				if(timeToComplete == null) {			//base case. if there's only 1 value tried so far, it's the best yo!
					taskToRun = t;					//i is the current time
													// i % tasks[t]['period'] -> how far into current period we are
							 
					timeToComplete = remainingExecutionTime[t];
				
				} else if( remainingExecutionTime[t] < timeToComplete){
					taskToRun = t;
					timeToComplete = remainingExecutionTime[t];
				}
			}
		}
//CHANGES STOP HERE
		//Decrement remaining execution time
		if(taskToRun != null){
			remainingExecutionTime[taskToRun]--;
			if(remainingExecutionTime[taskToRun] == 0){
				schedulable[taskToRun] = true;
			}
			
			if(taskToRun == timeSegment[2]){
				timeSegment[1]++;
			} else {
				if(timeSegment[0] != null){
					schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
				}
				timeSegment[0] = i;
				timeSegment[1] = i+1;
				timeSegment[2] = taskToRun;	
			}
		}  else {
			schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
			timeSegment = [null, null, null];
		}
	}	
	schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
	return schedule;
}

function edfSchedule(tasks, simLen){
	var schedule = new Array();
	schedule['name'] = "Earliest Deadline First";
	schedule['schedulable'] = true;
	schedule['timing'] = [];
	
	var remainingExecutionTime = new Array();
	var schedulable = new Array();
	for(t in tasks){
		remainingExecutionTime.push(0);
		schedulable.push(false);
	}
	var timeSegment = [null, null, null];
	for(var i = 0; i < simLen; i++){
		//If a multiple of task period, replenish remaining execution time
		for(t in tasks){
			if((i % tasks[t]['period']) == tasks[t]['start']){
				if(remainingExecutionTime[t] != 0){
					schedule['schedulable'] = false;
					return schedule;
				}
				remainingExecutionTime[t] = tasks[t]['wcet'];
			}
		}
	
		//Determine which task executes during each time unit.
		var taskToRun = null;
		var taskTimeToDeadline = null;
		for(t in tasks){
			var period = tasks[t]['period'];
			var start = tasks[t]['start']
			if(remainingExecutionTime[t] != 0){
				if(taskTimeToDeadline == null){
					taskToRun = t;
					taskTimeToDeadline = period - ((i-start) % period);
				} else if((period - ((i-start) % period)) < taskTimeToDeadline){
					taskToRun = t;
					taskTimeToDeadline = period - ((i-start) % period);
				}
			}
		}
		//Decrement remaining execution time
		if(taskToRun != null){
			remainingExecutionTime[taskToRun]--;
			
			if(taskToRun == timeSegment[2]){
				timeSegment[1]++;
			} else {
				if(timeSegment[0] != null){
					schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
				}
				timeSegment[0] = i;
				timeSegment[1] = i+1;
				timeSegment[2] = taskToRun;
			}
		} else {
			schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
			timeSegment = [null, null, null];
		}
	}	
	schedule['timing'].push([timeSegment[0], timeSegment[1], timeSegment[2]]);
	return schedule;
}

function gcd(a, b){
	var t;
	while(b != 0){
		t = b;
		b = a % b;
		a = t;
	}
	return a;
}
function lcm(a, b){
	return (a * b / gcd(a, b));
}	
function periodLCM(tasks){
	var args = tasks.slice(0);
	if(args.length == 1){
		return args[0]['period'];
	}
	if(args.length == 2){
		return lcm(args[0]['period'], args[1]['period']);
	} else {
		var arg0 = args[0];
		args.shift();
		return lcm(arg0['period'], periodLCM(args));
	}
}






















