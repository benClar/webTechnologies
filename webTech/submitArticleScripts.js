"use strict";

var ARTICLE_MAX = 300;
var TITLE_MAX = 10;
var TAG_MAX = 4;
var tags = {tagCount: 0};
var titleCount = 0;
var articleCount = 0;


addEventListener('load',function() {
  submitArticleStart(); 
  count(ARTICLE_MAX,"ASubBox","ArticleWordCount");
  count(TITLE_MAX,"titleSubBox","ArticleTitleCount");
  countTagBox(tags);
});

function submitArticleStart()	{


	document.getElementById("titleSubBox").addEventListener('keydown',function(e)	{

		if (titleCount > TITLE_MAX)	{
		setTextToColor("ArticleTitleCount","red");
			if(e.keyCode != 8 && e.keyCode != 46)	{
				e.preventDefault();
			}
		} else{
			setTextToColor("ArticleTitleCount","black");
		}
		setTimeout(function () {
		titleCount = count(TITLE_MAX,"titleSubBox","ArticleTitleCount")	
			// http://stackoverflow.com/questions/19038354/allowing-only-backspaces-in-a-textarea-with-javascript
		},1);
	});

	document.getElementById("tagSubBox").addEventListener('keydown',function(e)	{
		if(countTagBox(tags).tagCount > TAG_MAX)	{
			setTextToColor("TagCount","red");
			// http://stackoverflow.com/questions/19038354/allowing-only-backspaces-in-a-textarea-with-javascript
			if(e.keyCode == 8 || e.keyCode == 46)	{
				return;
			}
			e.preventDefault();
		}else{
			setTextToColor("TagCount","black");
		}
		setTimeout(function () {
			countTagBox(tags);
			createTagBox(tags);
		},1);
	});

	document.getElementById("ASubBox").addEventListener('keydown',function(e)	{
		if(articleCount > ARTICLE_MAX)	{
			setTextToColor("ArticleWordCount","red");
			if(e.keyCode != 8 && e.keyCode != 46)	{
				e.preventDefault();
			} 	
		}else{
			setTextToColor("ArticleWordCount","black");
		}
		/*http://stackoverflow.com/questions/19038354/allowing-only-backspaces-in-a-textarea-with-javascript*/
		setTimeout(function () {
			articleCount = count(ARTICLE_MAX,"ASubBox","ArticleWordCount")
		},1);
	});

	// document.getElementById("ArticleSubmitButton").addEventListener('click',function(e)	{
	// 	localStorage.setItem("slide", current);
	// 	current = localStorage.getItem("slide");
	// 	location.href="index.html";
	// });
}

function setTextToColor(tagID, color)	{
	document.getElementById(tagID).style.color = color;
}

function createTagBox(tagData)	{
	var output = "<ul class='ArticleKeyWords'>";
	for(var i = 0; i < tagData.tagString.length; i++)	{
		output += " " + "<li class='keywordItem'><a class='keywordHyper'>" + tagData.tagString[i] + "</a></li>";
	}
	output += "</ul>";
	document.getElementById("TagBoxes").innerHTML = output;
}

function countTagBox(tagData)	{
	var output = document.getElementById("tagSubBox").value;
	var words = output.split(";");
	for(var curr = 0; curr < words.length; curr++)	{
		if(words[curr] == "" )	{
			words.splice(curr,1);
			curr--;
		}
		if(words[curr] != undefined)	{
			words[curr].trim();
		}
	}
	document.getElementById("TagCount").innerHTML = words.length + "/" + TAG_MAX;
	tagData.tagCount = words.length;
	tagData["tagString"] = words;
	console.log(tagData.tagString);
	return tagData;
}

function count(max, countTag, displayTag)	{
	var output = document.getElementById(countTag).value;

	var words = output.split(" ");
	for( var curr = 0; curr < words.length; curr++)	{
		if(words[curr] == "" )	{
			words.splice(curr,1);
			curr--;
		}
	}
	document.getElementById(displayTag).innerHTML = words.length + "/" + max;
	return words.length;
}