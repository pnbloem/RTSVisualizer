var numTasks = 0;
$(function() {
	//window.alert('hello');

	$("#task_list").append("<div id='tasklist'></div>");
	$("#task_list").append("<div id='add_task' onclick='addTask()'>Add New Task</div>");
	$("#task_list").append("<div id='create_sched' onclick='scheduleTasks()'>Create Schedule</div>");
	
	$("#task_list").append("<form><input type='file' id='file_input' style='position:absolute; top:-100px;'  ></form>");
	// onchange='loadSched(this.files)'
	
	$("#task_list").append("<div id='load_sched' onclick='$(\"#file_input\").click();'>Load File</div>");
	$("#task_list").append("<div id='load_sched' onclick='saveSched()'>Save File</div>");

	$("#tasklist").append(generateTaskHTML(numTasks));
	$("#tasklist").accordion({'collapsible':true});
	
	$('#file_input').change(newLoadSched);
});

function newLoadSched(event) {
	file = this.files[0]; // not sure of the scope on 'this'...
	//window.alert(file.name + "\n" + file.size + "\n" + file.type);
	
	reader = new FileReader();
	reader.onload = function(event) { 
		//window.alert("okay!\n"+event.target.result);
		
		tree = $( $.parseXML(event.target.result) );
		
		$("#header").append( " :: "+tree.find("title").text() );
		
		$("#tasklist").accordion('destroy');
		$("#tasklist").empty();
		numTasks = 0;
		
		tree.find("task").each(function() {
			$("#tasklist").append(generateTaskHTML(numTasks));
			
			id = numTasks - 1;
			$("#tasklist h3:last a").text( $(this).find("name").text() );
						
			$("#name_"+id).val( $(this).find("name").text() );
			$("#wcet_"+id).val( $(this).find("wcet").text() );
			$("#start_"+id).val( $(this).find("start").text() );
			$("#period_"+id).val( $(this).find("period").text() );
			
			//window.alert(foo);
		});
		$("#tasklist").accordion({'collapsible':true});
		$("#tasklist").accordion("activate", $("#tasklist h3:last") );
		
		
	}
	reader.onerror = function(event) { 
		window.alert("Error! Could not read input file.\n"+event ); 
	}
	reader.readAsText(file);

	
	//window.alert("newLoadSched");
}


function loadSched(files) {
	if(files.length != 1) { return; }
	
	file = files[0];
	
	window.alert(file.name + "\n" + file.size + "\n" + file.type);
	
	// http://development.zeta-two.com/stable/file-api/file.html
	reader = new FileReader();
	reader.onload = function(event) { window.alert("okay!\n"+event.target.result); }
	reader.onerror = function(event) { window.alert("error!\n"+event.getMessage() ); }
	reader.readAsText(file);
}
function saveSched() {
	window.alert("saveSched!");
}


function generateTaskHTML(id){
	var tasklist_div = "<h3><a href='#'>New Task</a></h3>\
				<div id='"+id+"' class='task' > <!-- id='0' -->\
					<table>\
						<tr><th>Name</th><td><input id='name_"+id+"' class='widefield name' type='text' onblur='parseName(this)' /></td></tr>\
						<tr><th>WCET</th><td><input id='wcet_"+id+"' type='number' class='wcet' /></td></tr>\
						<tr><th>Start Time</th><td><input id='start_"+id+"' type='number' class='start' /></td></tr>\
						<tr><th>Period (Deadline)</th><td><input id='period_"+id+"' type='number' class='period' /></td></tr>\
						<tr><td colspan='2' style='text-align:center'><div class='del_task' onclick=delTask("+id+")>Delete Task</div></td></tr>";
						
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

function delTask(id) {
	$("#tasklist").accordion('destroy');
	
	convert = $("#"+id).siblings('div');
	$("#"+id).prev().remove();
	$("#"+id).remove();
	convert.each(function(ndx, ele) {
		$(ele).attr('id', ndx);
	});
	numTasks--;
	
	$("#tasklist").accordion({'collapsible':true});
	$("#tasklist").accordion("activate", $("#tasklist h3:last") );
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


