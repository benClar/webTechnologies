"use strict";

var ARTICLE_MAX = 300;
var TITLE_MAX = 10;
var TAG_MAX = 4;
var tags = {tagCount: 0};
var titleCount = 0;
var articleCount = 0;
var articleMinimum = 50;

addEventListener('load',function() {
  start();
  submitArticleStart(); 
  count(ARTICLE_MAX,"ASubBox","ArticleWordCount");
  count(TITLE_MAX,"titleSubBox","ArticleTitleCount");
  countTagBox(tags);
  startLoginScripts();
  setLoginInterface();
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

	document.getElementById("ArticleSubmitButton").addEventListener('click',function(e)	{
		var formElements = document.getElementById('newArticle_form').elements;
		var data = {};
		for( var i = 0; i < formElements.length; i++)	{
			if(formElements[i].type != "button")	{
				data[formElements[i].name] = formElements[i].value;
			}
		}
		if(validateArticle())	{
			// data = formatTags(data);
			data["TagBox"] = toCapitalCase(data["TagBox"]);
			console.log(data);
			createArticle(data);
		}
	});
}

// http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
function toCapitalCase(str)	{
	str = str.toLowerCase()
    return str.replace(/\w\S*/g, function(txt){
    	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });

}


function validateArticle()	{
	if(validateTitle() && validateTags() && validateArticleBody())	{
		return true;
	}

	return false;
}

function validateTags()	{
	if(tags["tagCount"] > TAG_MAX)	{
		setError("articleTag_error","Number of tags Cannot be more than  " + TAG_MAX);
		return false;
	}

	if(tags["tagCount"] <= 0)	{
		setError("articleTag_error","Article must have at least one tag");
		return false;
	}

	setError("articleTag_error","");
	return true;	

}

function validateTitle()	{
	if(titleCount > TITLE_MAX)	{
		setError("articleTitle_error","Article Cannot be more than  " + TITLE_MAX + " Words." );
		return false;
	}

	if(titleCount <= 0)	{
		setError("articleTitle_error","Article Must be at least one word long." );
		return false;
	}


	setError("articleTitle_error","");
	return true;
}

function validateArticleBody()	{
	if(articleCount > ARTICLE_MAX)	{
		setError("articleBody_error","Article Cannot be more than "+ ARTICLE_MAX + " words." );
		return false;
	}

	if(articleCount < articleMinimum)	{
		setError("articleBody_error","Article Must be at least "+ articleMinimum + " words." );
		return false;
	}
	setError("articleBody_error","");
	return true;
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
	return tagData;
}

function formatTags(data)	{
	data["TagBox"] = data["TagBox"].split(";");
	for(var i = 0; i < data["TagBox"].length; i++)	{
		data["TagBox"][i] = data["TagBox"][i].trim().toLowerCase();
		if(data["TagBox"][i] == "")	{
			data["TagBox"].splice(i,1);
		}
	}
	return data;
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