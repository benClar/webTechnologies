"use strict";

addEventListener("load",function() {
    userPageStart();
    start();
    startLoginScripts(); 
});

// var tagList = ;

var output;



// http://www.webdesignerdepot.com/2013/08/how-to-use-html5s-drag-and-drop/
function dragStart(ev) {
   ev.dataTransfer.effectAllowed='move';
   ev.dataTransfer.setData("Text", ev.target.getAttribute('id'));
   ev.dataTransfer.setDragImage(ev.target,100,100);
   return true;
}
function dragEnter(ev) {
   ev.preventDefault();
   return true;
}
function dragOver(ev) {
     ev.preventDefault();
}
function dragDrop(ev) {
	var textContent = ('innerText' in document) ?'textContent' : 'innerText' ;
    	var data = ev.dataTransfer.getData("Text");
    	console.log(data);
	if(ev["target"]["id"] == "UserTags")	{
   		console.log("toUserTags");
   		linkTagWithUser(data,getAvailableTags);
   } else if(ev["target"]["id"] == "AllTags")	{
   		console.log("AllTags");
   		unlinkTagWithUser(data,getAvailableTags);
   }   
}


function generateTags(target,tags)	{
	var output = "";
	for(var curr = 0; curr < tags.length; curr++)	{
		output +=" <li class='keywordItem'> " + 
						"<a class='keywordHyper' ondragstart='return dragStart(event)' draggable='true' href='#' id='"+tags[curr] + "'>" + tags[curr] + "</a>" + 
					"</li>";

	}
	document.getElementById(target).innerHTML = output;
}

function generateUserTag()	{
	var output = "";
	for(var curr = 0; curr < tagTracker["userTags"].length; curr++)	{

		output +=" <li class='keywordItem' ondragstart='return dragStart(event)'> "+
		"<a class='keywordHyper' ondragstart='return dragStart(event)' draggable='true' href='#' id='"+tags[curr] + "'>" + tagTracker["userTags"][curr] + "</a> </li>";
	}
}

function userPageStart()	{
	document.getElementById("TagSearch").addEventListener('keydown',function(e)	{
		setTimeout(function () {
			sendSearchBox();
		},1);
	});

	generateUserPageContent();
	
}

function sendSearchBox()	{
	searchTags(document.getElementById("TagSearch").value);
}

function generateUserPageContent()	{
	getAvailableTags(setLoginInterface);
}

