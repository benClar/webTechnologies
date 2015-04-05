"use strict";

addEventListener("load",function() {
    userPageStart(); 
});

// var tagList = ;
var tagTracker = { userTags:[], allTags:["Cold War","WW1","WW2","20th Century Iraq"," Iran","Napolean","French Revolution", "Ancient Rome","Credit Crunch","US Slavery","Ancient Egypt","Aztecs","Saxons","Vikings","Ancient Man","Korean War","Vietnam War","Spanish Armada","History of Medicine","Home Rule","Easter Rising"]};

var savedUserTags = localStorage.getItem("savedUserTags");
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
	console.log(ev);
   	var data = ev.dataTransfer.getData("Text");
   	ev.target.appendChild(document.getElementById(data));
   if(ev["target"]["id"] == "UserTags")	{
   		tagTracker["userTags"] = removeElements("",ev["target"][textContent].split('\n'));
   		tagTracker["allTags"] = removeElements(tagTracker["userTags"][tagTracker["userTags"].length -1],tagTracker["allTags"]);
   		destroyTag(data);
   		generateUserTag();
   		generateTags();
   } else if(ev["target"]["id"] == "AllTags")	{
   		document.getElementById("TagSearch").value = "";
   		generateTags();
   		tagTracker["allTags"] = removeElements("",ev["target"][textContent].split('\n')); 		
   		tagTracker["userTags"] = removeElements(tagTracker["allTags"][tagTracker["allTags"].length -1],tagTracker["userTags"]);
   		//document.getElementById("TagSearch").value = "";
   		destroyTag(data);
   		generateTags();
   		generateUserTag();
   }   
   localStorage.setItem("savedUserTags", tagTracker["userTags"]);
   ev.stopPropagation();
   return false;
}

function removeElements(val,array)	{

	for(var curr = 0; curr < array.length; curr++)	{
		if(array[curr] == val )	{
			array.splice(curr,1);
			curr--;
		}
	}
	return array;
}

function generateTags()	{
	var searchString = new RegExp(document.getElementById("TagSearch").value, "i");
	var output = "";
	for(var curr = 0; curr < tagTracker["allTags"].length; curr++)	{
		if(searchString.test(tagTracker["allTags"][curr]))	{
			 if(document.getElementById("tag" + curr) != null && document.getElementById("tag" + curr) != undefined )	{
			 	var tag = document.getElementById("tag" + curr);
			 	tag.parentNode.removeChild(tag);
			 }
			output +=" <li class='keywordItem' id='tag" + curr +"' ondragstart='return dragStart(event)' draggable='true'><a class='keywordHyper' id='tag" + curr+"' ondragstart='return dragStart(event)' draggable='true' href='#'>" + tagTracker["allTags"][curr] + "</a> </li>";
		}
	}
	document.getElementById("allTags").innerHTML = output;
}

function generateUserTag()	{
	var output = "";
	for(var curr = 0; curr < tagTracker["userTags"].length; curr++)	{
		if(document.getElementById("tag" + id) != undefined)	{
			destroyTag("tag" + id);
		}
		var id = tagTracker["allTags"].length + curr;
		output +=" <li class='keywordItem' id='tag" + id +"' ondragstart='return dragStart(event)' draggable='true'> <a class='keywordHyper' id='tag" + id + "' ondragstart='return dragStart(event)' draggable='true' href='#'>" + tagTracker["userTags"][curr] + "</a> </li>";
	}
	document.getElementById("UserTags").innerHTML = output;
}



function destroyTag(tag)	{
		var dTag = document.getElementById(tag)
		dTag.parentNode.removeChild(dTag);
}

function setUpUserTags()	{
	tagTracker["userTags"] = savedUserTags.split(',');
	for(var curr = 0; curr < tagTracker["userTags"].length; curr++)	{
		tagTracker["allTags"] = removeElements(tagTracker["userTags"][curr],tagTracker["allTags"]);
	}
}

function userPageStart()	{
	if(savedUserTags != null)	{
		setUpUserTags();
	}
	generateTags();
	generateUserTag();
	document.getElementById("TagSearch").addEventListener('keydown',function(e)	{
		setTimeout(function () {
			generateTags();
		},1);
	});

}

