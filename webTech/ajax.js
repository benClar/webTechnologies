"use strict"

var ARTICLES_PER_PAGE = 10;

var xmlhttp;

if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
} else {
// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}

function generateArticle(articleID)	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var databaseResult = JSON.parse(xmlhttp.responseText);
			formatArticle(databaseResult);
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"loadArticle","data" : { "articleID":"' + articleID +'"} }');
}



function create_new_account(details)	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var databaseResult = JSON.parse(xmlhttp.responseText)
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"createNewAccount","data" : { "account":"' + details['newUserName'] + '", "password":"' + details['newPassword'] + '","email":"' + details['newEmail'] + '"} }');
}

function logout()	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			hideElement('logged_in_menu_logout'); 
			hideElement('logged_in_menu_pref'); 
			showElement('logged_out_menu');
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"logout"}');
}

function submitArticleClick(callback)	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var loggedInResult = JSON.parse(xmlhttp.responseText);
			if(loggedInResult["data"]["loggedIn"] == true)	{
				redirectToPage("newArticle.html");
			} else	{
				callback();
			}
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"logInStatus"}');
}

function voteClick(vote, articleid, callback,ev)	{

	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var loggedInResult = JSON.parse(xmlhttp.responseText);
			if(loggedInResult["data"]["loggedIn"] == true)	{
				castVote(vote,articleid,ev);
			} else	{
				callback();
			}
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"logInStatus"}');
}

function castVote(vote,articleID,ev)	{
	if(vote == "like")	{
		ev.preventDefault();
		ToggleLike();
	} else if (vote == "dislike") {
		ev.preventDefault();
		ToggleDislike();
	}
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var newVotePercentage = JSON.parse(xmlhttp.responseText);
			generateArticleVotes(newVotePercentage);

		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"castVote", "data":{"articleID": "' + articleID + '", "voteType" : "' + vote + '"} }');
}

function redirectToPage(articlePage)	{
	window.location.href = 'https://localhost:8001/' + articlePage;
}

function setLoginInterface()	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var loggedInResult = JSON.parse(xmlhttp.responseText);
			if(loggedInResult["data"]["loggedIn"] == true)	{
				console.log(loggedInResult["data"]["loggedIn"]);
	    		hideElement('logged_out_menu'); 
	    		showElement('logged_in_menu');
	   		} else	{
	    		hideElement('logged_in_menu_logout'); 
	    		hideElement('logged_in_menu_pref'); 
	    		showElement('logged_out_menu');
	    	}
		}

	}
	
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"logInStatus"}');
}

function login(details)	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var passwordResult = JSON.parse(xmlhttp.responseText);
			if(passwordResult["data"]["passwordMatched"]==true)	{
				successfulLogin(details["existingUsername"]);
			} else	{
				setError("login_error","Username-Password combination incorrect");
			}
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"login","data" : { "account":"' + details['existingUsername'] + '", "password":"' + details['existingPassword'] + '"} }');
}

function successfulLogin(username)	{
	console.log("successfulLogin");
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"loginSuccess","data" : { "account":"' + username + '"} }');
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			window.location.href = 'https://localhost:8001/userpage.html'
		}
	}
}


function createArticle(details)	{
	// xmlhttp.onreadystatechange=function() {
	// 	if (xmlhttp.readyState==4 && xmlhttp.status==200) {

	// 	}
	// }
	console.log(details);
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"createNewArticle", "data" : { "title": "' + details["ArticleTitleBox"] + '", "tags" : "' + details["TagBox"] + '", "articleBody" : "' + details["ArticleBodyBox"] + '" } }');
}

function checkUsernameUnique(details,callback)	{
	var result;
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var databaseResult = JSON.parse(xmlhttp.responseText)
			if(databaseResult.length == 0){
				result =  true;
				callback(details,result);
			} else {
				result = false;
				callback(details,result);
			}
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"checkUserUnique","data" : { "account":"' + details['newUserName'] + '"} }');
}


function getArticles(type,target,tag,articleData) {
	tag = tag.replace("+"," ");
	setPageTag(tag);

	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var databaseResult = JSON.parse(xmlhttp.responseText)
			var output = formatRows(databaseResult);
			console.log("AJAX");
			console.log(output.length);
			if(output == "none"){ return; }
			console.log(output.length);
			if(type != "curr")	{
				setArticleIndex(type,target,articleData);
			}

			document.getElementById(target).innerHTML = "";
			for(var article = 0; article < output.length; article++)	{
				document.getElementById(target).innerHTML += output[article];

				if(databaseResult[article]["upvotes"] != null)	{
					document.getElementById("upvote_" + databaseResult[article]["articleID"]).innerHTML = databaseResult[article]["upvotes"]+"%";
					document.getElementById("downvote_" + databaseResult[article]["articleID"]).innerHTML = databaseResult[article]["downvotes"]+"%";
				}

				document.getElementById("upvote_" + databaseResult[article]["articleID"]).style.width=  databaseResult[article]["upvotes"]+"%";
				document.getElementById("downvote_" + databaseResult[article]["articleID"]).style.width=  databaseResult[article]["downvotes"]+"%";
			}
			output =[];
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"articleRequest","data" : { "index":"' + articleData[target] + '","aTag":"' + tag +'","order":"'+ target +'"} }');
}

function setPageTag(tag)	{
	if(tag == "all")	{
		document.getElementById("PageTag").innerHTML = "Front Page";
	} else	{
		document.getElementById("PageTag").innerHTML = tag;
	}
}

function formatArticle(article)	{
	document.getElementById("bannerText").innerHTML = article[0]["title"];
	generateArticleVotes(article[0]);
	document.getElementById("ArticleBodyContent").innerHTML= article[0]["articleContent"];
	document.getElementById('InArticle_ArticleKeyWords').innerHTML = addTags(article[0]["groupedTags"]);
	setVotingButtons(articleID);
}

function setVotingButtons(articleID)	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var databaseResult = JSON.parse(xmlhttp.responseText);
			if(databaseResult.length > 0)	{
				if(databaseResult[0]["downvote"] == 1)	{
					ToggleDislike();
				} else if(databaseResult[0]["upvote"] == 1){
					ToggleLike();
				}
			}
		}
	}	
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"getUserVote","data" : { "articleID":"' + articleID + '"} }');
}

function generateArticleVotes(article)	{
	if(article["upvotes"] == null)	{
		document.getElementById("articleUpvotes").innerHTML = "50%";
		document.getElementById("articleUpvotes").style.width= "50%";
	} else	{
		document.getElementById("articleUpvotes").innerHTML = String(article["upvotes"]).split(".")[0] + "%";
		document.getElementById("articleUpvotes").style.width= article["upvotes"] + "%";
	}

	if(article["downvotes"] == null)	{
		document.getElementById("articleDownvotes").innerHTML = "50%";
		document.getElementById("articleDownvotes").style.width= "50%";
	} else	{
		document.getElementById("articleDownvotes").innerHTML = String(article["downvotes"]).split(".")[0] + "%";
		document.getElementById("articleDownvotes").style.width= article["downvotes"] + "%";
	}	
}

function addTags(tags)	{
	var output="";
	tags = tags.split(";")
	for(var i = 0; i < tags.length; i++)	{
		output = output.concat('<li class="keywordItem"><a class="keywordHyper" href="sub_page.html?' + tags[i] + '">'+tags[i] + '</a></li> ');
	}
	return output;
}

function formatRows(result)	{

	var rowCount = countJSON(result);
	var cRow;
	var cTag;
	var output = [];
	var article;
	var tagFormat;
	if(result == "none")	{ return "none"; }

	for(cRow = 0; cRow < rowCount; cRow++)	{
		result[cRow]["groupedTags"] = result[cRow]["groupedTags"].split(";");
		article = '<div class="ArticleElement"> <div class="ArticleThumbNail"> <img alt="thumbnail" src="./images/pres_Kennedy.jpg"/> </div> <div class="ArticleTitle"> <a href="./article.html?articleTag=' + result[cRow]["articleID"] + '">' + result[cRow]["title"] + '</a> <ul class="ArticleKeyWords">';
		
		for(cTag = 0; cTag < result[cRow]["groupedTags"].length; cTag++)	{	
			tagFormat = result[cRow]["groupedTags"][cTag].replace(" ", "+");
			article = article.concat('<li class="keywordItem"><a class="keywordHyper" href="sub_page.html?subPage=' + tagFormat + '">' + result[cRow]["groupedTags"][cTag] + '</a></li>');
		}
		article = article.concat('</ul> </div> <div class="ArticleRatings"> <div id = "upvote_' + result[cRow]["articleID"] + '" class="upvotes">50%</div> <div id="downvote_' + result[cRow]["articleID"] + '" class="downvotes">50%</div> </div> </div>')
		output.push(article);
	}

	return output;
}

function countJSON(jsonObject)	{
	var i = 0
	while(jsonObject[i])	{
		i++;
	}
	return i;
}

function setArticleIndex(type,target,articleData)	{

	switch(type)	{
		case "next":
			articleData[target] += ARTICLES_PER_PAGE;
			break;
		case "prev":
			if(articleData[target] > 0)	{
				articleData[target] -= ARTICLES_PER_PAGE;
			}
			break;
		default:
			break;
	}

}


