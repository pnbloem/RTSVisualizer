var numTasks = 0;
$(function() {
	//window.alert('hello');

	$("#task_list").append("<div id='tasklist'></div>");
	$("#task_list").append("<div id='add_task' onclick='addTask()'>Add New Task</div>");
	$("#task_list").append("<div id='create_sched' onclick='scheduleTasks()'>Create Schedule</div>");
	$("#tasklist").append(generateTaskHTML(numTasks));
	$("#tasklist").accordion({'collapsible':true});
});

function generateTaskHTML(id){
	var tasklist_div = "<h3><a href='#'>New Task</a></h3>\
				<div id='"+id+"' class='task' > <!-- id='0' -->\
					<table>\
						<tr><th>Name</th><td><input id='name_"+id+"' class='widefield' type='text' onblur='parseName(this)' /></td></tr>\
						<tr><th>WCET</th><td><input id='wcet_"+id+"' type='number' /></td></tr>\
						<tr><th>Start Time</th><td><input id='start_"+id+"' type='number' /></td></tr>\
						<tr><th>Period (Deadline)</th><td><input id='period_"+id+"' type='number' /></td></tr>"
					
	tasklist_div += "</table></div></div>";
	numTasks++;
	return tasklist_div;
	/*
	<!--	<tr><th>Priority</th><td>\
							<ul class='priority'>\
								<li class='pri-up'><a href='#' onclick='moveUp(this)'><img src='img/001_28.png' alt='up'/></a></li>\
								<li class='pri-down'><a href='#' onclick='moveDown(this)'><img src='img/001_26.png' alt='up'/></a></li>\
							</ul></td></tr>\
						<tr><th>Color</th><td>--</td></tr> -->\
	*/
}

function addTask() {
	$("#tasklist").accordion('destroy');
	$("#tasklist").append(generateTaskHTML(numTasks));
	$("#tasklist").accordion({'collapsible':true});
	$("#tasklist").accordion("activate", $("#tasklist h3:last") );
}

function parseName(event) {
	name = $(event).attr('value');
	if(name == '')
		name = "Unnamed Task";
	
	// rename title bar to the task name
	$(event).parentsUntil('#tasklist').prev('h3').children('a').html(name);
}

function moveUp(element) {
	if( $("#tasklist").children().size() < 4) {
		//window.alert( $("#tasklist").children().size() );
		return;
	}
	$("#tasklist").accordion('destroy');
		
	div = $(element).parentsUntil('#tasklist');
	window.alert(div.html())
	//index = $("#tasklist").index(div);
	
	
	//endofhigher = div.prev('h3');
	header = div.prev('h3').detach();
	div.detach();
	
	// use .after(selector) to reinsert
	//header.insertBefore(endofhigher);
	//div.insertBefore(endofhigher);
	
	$("#tasklist").accordion(); //{"collapsible":true}
	$("#tasklist").accordion("activate", $("#tasklist h3:last") );
}

function moveDown(element) {
	window.alert('bai!');
}


