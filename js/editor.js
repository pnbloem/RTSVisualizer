
$(function() {
	//window.alert('hello');
	$("#tasklist").accordion({'collapsible':true});
});


function addTask() {
	$("#tasklist").accordion('destroy');
	
	header = $("#tasklist h3:last").clone();	
	content = $("#tasklist div:last").clone();	
	//id = parseInt( content.attr('id'), 10) + 1;
	//id = id.toString();
	//content.attr('id', id);
	
	$("#tasklist").append( header, content ); //content.attr('id', id)
	$("#tasklist h3:last a").html("New Task");	
	
	$("#tasklist").accordion(); //{"collapsible":true}
	$("#tasklist").accordion("activate", $("#tasklist h3:last") );
	//$("#tasklist").accordion('activate', id.toString());
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


