"use strict"

var articleData = {
	'AllContent': 0,
	'NewContent': 0,
	'ControversialContent':0
};

var ARTICLES_PER_PAGE = 10;

var xmlhttp;

if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
	xmlhttp=new XMLHttpRequest();
} else {
// code for IE6, IE5
	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
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

function login(details)	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var passwordResult = JSON.parse(xmlhttp.responseText);
			if(passwordResult["data"]["passwordMatched"]==true)	{
				console.log(details);
				successfulLogin(details["existingUsername"]);
			}
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"login","data" : { "account":"' + details['existingUsername'] + '", "password":"' + details['existingPassword'] + '"} }');
}

function successfulLogin(username)	{
	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var response = JSON.parse(xmlhttp.responseText);

		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"loginSuccess","data" : { "account":"' + username + '"} }');
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


function getArticles(type,target) {

	formatQuery(type,target);


	xmlhttp.onreadystatechange=function() {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var databaseResult = JSON.parse(xmlhttp.responseText)
			var output = formatRows(databaseResult);
			// console.log(output);
			document.getElementById(target).innerHTML = "";
			for(var article = 0; article < output.length; article++)	{
				// console.log(output[article]);
				document.getElementById(target).innerHTML += output[article];

				document.getElementById("upvote_" + databaseResult[article]["articleID"]).innerHTML = databaseResult[article]["upvotes"]+"%";
				document.getElementById("downvote_" + databaseResult[article]["articleID"]).innerHTML = databaseResult[article]["downvotes"]+"%";

				document.getElementById("upvote_" + databaseResult[article]["articleID"]).style.width=  databaseResult[article]["upvotes"]+"%";
				document.getElementById("downvote_" + databaseResult[article]["articleID"]).style.width=  databaseResult[article]["downvotes"]+"%";
			}
			output =[];
		// xmlhttp.responseText
		}
	}
	xmlhttp.open("POST","https://localhost:8001/",true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('{"request":"articleRequest","data" : { "index":"' + articleData[target] + '"} }');

}

function formatRows(result)	{

	var rowCount = countJSON(result);
	var cRow;
	var cTag;
	var output = [];
	var article;
	var tagFormat;
	for(cRow = 0; cRow < rowCount; cRow++)	{
		result[cRow]["groupedTags"] = result[cRow]["groupedTags"].split(";");
		article = '<div class="ArticleElement"> <div class="ArticleThumbNail"> <img alt="thumbnail" src="./images/pres_Kennedy.jpg"/> </div> <div class="ArticleTitle"> <a href="./article.html?articleTag=' + result[cRow]["articleID"] + '">' + result[cRow]["title"] + '</a> <ul class="ArticleKeyWords">';
		
		for(cTag = 0; cTag < result[cRow]["groupedTags"].length; cTag++)	{	
			tagFormat = result[cRow]["groupedTags"][cTag].replace(" ", "+");
			article = article.concat('<li class="keywordItem"><a class="keywordHyper" href="sub_page.html?' + tagFormat + '">' + result[cRow]["groupedTags"][cTag] + '</a></li>');
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

function formatQuery(type, target)	{

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


