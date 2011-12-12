//var numTasks = 0;
$(function() {
	//window.alert('hello');

	$("#task_list").append("<div id='tasklist'></div>");
	$("#task_list").append("<div id='add_task' onclick='addTask()'>Add New Task</div>");
	$("#task_list").append("<div id='create_sched' onclick='scheduleTasks()'>Create Schedule</div>");
	
	$("#task_list").append("<form><input type='file' id='file_input' style='position:absolute; top:-100px;'  ></form>");
	// onchange='loadSched(this.files)'
	
	$("#task_list").append("<div id='load_sched' onclick='$(\"#file_input\").click();'>Load File</div>");
	$("#task_list").append("<div id='load_sched' onclick='saveSched()'>Save File</div>");

	$("#tasklist").append(generateTaskHTML());
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
		
		$("#header").html("Real-Time Schedule Visualizer :: "+tree.find("title").text() );
		
		$("#tasklist").accordion('destroy');
		$("#tasklist").empty();
		//numTasks = 0;
		
		tree.find("task").each(function() {
			$("#tasklist").append(generateTaskHTML());
			
			//id = numTasks - 1;
			$("#tasklist h3:last a").text( $(this).find("name").text() );
			
			$("#tasklist div.task:last .name").val( $(this).find("name").text() );
			$("#tasklist div.task:last .wcet").val( $(this).find("wcet").text() );
			$("#tasklist div.task:last .start").val( $(this).find("start").text() );
			$("#tasklist div.task:last .period").val( $(this).find("period").text() );
			
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
	
	title = $("#header").html();
	title = title.substring( title.indexOf(":: ")+3 );
		
	var xml = "<input>\n\t<title>"+title+"</title>\n\t<taskset>\n";
	$("#tasklist div.task").each(function(){
		//window.alert($(this).html());
		xml += "\t\t<task>\n";
		xml += "\t\t\t<name>"+$(this).find(".name").val()+"</name>\n";
		xml += "\t\t\t<wcet>"+$(this).find(".wcet").val()+"</wcet>\n";
		xml += "\t\t\t<start>"+$(this).find(".start").val()+"</start>\n";
		xml += "\t\t\t<period>"+$(this).find(".period").val()+"</period>\n";

		
		xml += "\t\t</task>\n";
		
	});
	xml += "\t</taskset>\n</input>";
	
	//window.alert(xml);
	
	//uriContent = "data:text/xml," + encodeURIComponent(xml);
	uriContent = "data:application/octet-stream,"+encodeURIComponent(xml);
	newWindow = window.open(uriContent, 'newDocument');
	
}


function generateTaskHTML(){
	//id='"+id+"' 
	var tasklist_div = "<h3><a href='#'>New Task</a></h3>\
				<div class='task' >\
					<table>\
						<tr><th>Name</th><td><input class='widefield name' type='text' onblur='parseName(this)' /></td></tr>\
						<tr><th>WCET</th><td><input type='number' class='wcet' /></td></tr>\
						<tr><th>Start Time</th><td><input type='number' class='start' /></td></tr>\
						<tr><th>Period (Deadline)</th><td><input type='number' class='period' /></td></tr>\
						<tr><td colspan='2' style='text-align:center'><div class='del_task' onclick='delTask(this)'>Delete Task</div></td></tr>";
						
	tasklist_div += "</table></div></div>";
	//numTasks++;
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

function delTask(element) {
	$("#tasklist").accordion('destroy');
	
	$(element).closest("div.task").prev().remove();
	$(element).closest("div.task").remove();
	
	//numTasks--;
	
	$("#tasklist").accordion({'collapsible':true});
	$("#tasklist").accordion("activate", $("#tasklist h3:last") );
}

function addTask() {
	$("#tasklist").accordion('destroy');
	$("#tasklist").append(generateTaskHTML());
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


