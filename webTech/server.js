"use strict"

var http = require('http');
var fs = require('fs');
var net = require('net');
var sqlQuery = require("./do/getArticles.js");
var accounts = require("./do/createAccount.js");
var https = require('https');
var tls = require('tls')
var session = require('sesh/lib/core').session;

var letter = "abcdefghijklmnopqrstuvwxyz".charAt(Math.floor(Math.random()*26));
var prefix = "site-" + letter + "/";

var types = {
    'html' : 'text/html, application/xhtml+xml',
    'css'  : 'text/css',
    'js'   : 'application/javascript',
    'png'  : 'image/png',
    'mp3'  : 'audio/mpeg', // audio
    'aac'  : 'audio/aac',  // audio
    'mp4'  : 'video/mp4',  // video
    'webm' : 'video/webm', // video
    'gif'  : 'image/gif',  // only if imported unchanged
    'jpeg' : 'image/jpeg', // only if imported unchanged
    'svg'  : 'image/svg+xml',
    'json' : 'application/json',
    'pdf'  : 'application/pdf',
    'txt'  : 'text/plain', // plain text only
    'xhtml': '#not suitable for dual delivery, use .html',
    'htm'  : '#proprietary, non-standard, use .html',
    'jpg'  : '#common but non-standard, use .jpeg',
    'rar'  : '#proprietary, non-standard, platform dependent, use .zip',
    'doc'  : '#proprietary, non-standard, platform dependent, ' +
              'closed source, unstable over versions and installations, ' +
              'contains unsharable personal and printer preferences, use .pdf',
};

function start()	{
	http.createServer(serve).listen(8000);
	var body="";
	// httpServer;
	//Each http request
	// httpServer.on("request",serve);
	var options = {
	  key: fs.readFileSync('key.pem'),
	  cert: fs.readFileSync('cert.pem')
	};
	var a = https.createServer(options, serve).listen(8001);


}

function redirect(response, url)	{
	// response.redirect(url);
	response.writeHead(302,{
  		'Location': url
	});
	response.end();
}

function needs_redirect(request)	{
	if(!request.connection.encrypted)	{
		return "https://" + request['headers']['host'].split(":")[0] + ":8001" + request.url;
	}
	return false;
}

function starts(file,prefix)	{
	if(file.substring(0,prefix.length) == prefix)	{
		console.log("TRUE"  + file.substring(0,prefix.length));
		return true;
	} else 	{
		console.log("FALSE"  + file.substring(0,prefix.length));
		return false;
	}
}

function serve(request,response)	{
	session(request, response, function(request, response){

		var url = require('url').parse(request.url); //Take a URL string, and return an object.
		var new_url;

		switch(request["headers"]["content-type"])	{
			case "application/x-www-form-urlencoded":
				return formRequest(request, response);
				break;
			default:
				break;
		}

		if((new_url = needs_redirect(request))) { 
			return redirect(response,new_url);
		}
		var filename = url.pathname.substring(1);
		// console.log("FILENAME:"  + filename);
		if(!starts(filename,prefix)){
			return redirect(response,"https://" + request['headers']['host'].split(":")[0] + ":8001/" + prefix + filename);
		}
		console.log("HERE");
		filename = filename.substring(prefix.length);
		console.log(filename);
		url['path'] = '.' + url['path'];
		console.log("PATH" + url['path']);
		if(url['path'] === "./" + prefix + "index.html" || url['path'] === "./" + prefix)	{
			return redirect(response,"https://" + request['headers']['host'].split(":")[0] + ":8001/" + prefix + "index.html?subPage=all");
		}




		var type = findType(filename.substring(filename.lastIndexOf(".") + 1));
		if(!type) return fail(response,http.STATUS_CODES["404"]);
		console.log(filename);
		fs.readFile(filename, ready);

		function ready(error, content)	{
			if(error)	{
				response.writeHead(404, {
					"Content-Type" : "text/plain; charset=UTF-8"});
				response.write(error.message);
				response.end();
			} else	{
				response.writeHead(200,
					{"Content-Type" : type
				});
				response.write(content);
				response.end();
			}
		}
	});
}

//https://docs.nodejitsu.com/articles/HTTP/servers/how-to-read-POST-data
function formRequest(request, response)	{
	var body ="";
	var action;
	request.on('data', function (chunk) {
		 body += chunk; //Waiting to recieve all of POST data
	});

	//only run when all POST data has been recieved
	request.on('end', function () {
		action = JSON.parse(body);
		switch(action["request"])	{
			case "articleRequest":
				if(action["data"]["aTag"] == "all")	{
					var queryString = "SELECT a.title, a.articleID, a.groupedTags, a.submissionDate, (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes FROM( SELECT article.title, article.submissionDate, article.articleID, GROUP_CONCAT(articleTag.tag,';') as groupedTags FROM article JOIN articleTag ON article.articleID = articleTag.articleID GROUP BY article.articleID, article.title) a LEFT JOIN vote ON a.articleID = vote.articleID GROUP BY a.title, a.articleID, a.groupedTags ORDER BY a.submissionDate DESC;"
					sqlQuery.getArticleList(queryString,action["data"]["index"],action["data"]["type"],response,finishResponse);
				} else {
					var queryString ="SELECT a.title, a.articleID, a.submissionDate, a.groupedTags, (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes FROM( SELECT articleTag.articleID, article.submissionDate, GROUP_CONCAT(articleTag.tag,';') as groupedTags , article.title FROM( SELECT * FROM articleTag WHERE articleTag.tag = '"+ action["data"]["aTag"] +"') matchedArticles JOIN articleTag ON articleTag.articleID = matchedArticles.articleID JOIN article on article.articleID = matchedArticles.articleID GROUP BY article.title, articleTag.articleID) a LEFT JOIN vote ON a.articleID = vote.articleID GROUP BY a.title, a.articleID, a.groupedTags ORDER BY a.submissionDate DESC";
					sqlQuery.getArticleList(queryString,action["data"]["index"],action["data"]["type"],response,finishResponse);
				}
				break;
			case "createNewAccount":
				accounts.createAccounts(action["data"]["account"],action["data"]["password"],action["data"]["email"],response,finishResponse);
			case "checkUserUnique":
				var queryString = 'SELECT account FROM user WHERE account = "' + action["data"]["account"] + '"';
				sqlQuery.query(queryString,response,finishResponse);
				break;
			case "login":
				accounts.validateAccount(action["data"]['account'],action["data"]['password'],response,finishResponse_String);
				break;
			case "loginSuccess":
				request.session.data.user = action["data"]['account'];
				// console.log(request.session.data.user);
				finishResponse_String(null,response,"LoggedIn");
				break;
			case "logInStatus":
				if(request.session.data.user != "Guest")	{
					finishResponse_String(null,response,'{"response":"logInStatus", "data" : { "loggedIn" : true } }');
				} else	{
					finishResponse_String(null,response,'{"response":"logInStatus", "data" : { "loggedIn" : false } }');
				}
				break;
			case "logout":
				request.session.data.user = "Guest"
				finishResponse_String(null,response,"LoggedOut");
				break;
			case "redirect":
				// redirect(response,"https://" + request['headers']['host'].split(":")[0] + ":8001" + "/" + action["data"]["target"]);
				break;
			case "createNewArticle":
				console.log("Creating new article");
				sqlQuery.addNewArticle(action["data"],request.session.data.user,response,finishResponse_String);
				break;
			case "loadArticle":
				var queryString = "SELECT a.title, a.articleContent, a.groupedTags, (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes FROM( SELECT article.title, article.articleContent, article.articleID, GROUP_CONCAT(articleTag.tag,';') as groupedTags FROM article JOIN articleTag ON article.articleID = articleTag.articleID WHERE article.articleID =" + action["data"]["articleID"] + ") a LEFT JOIN vote ON a.articleID = vote.articleID GROUP BY a.title, a.articleID, a.groupedTags ORDER BY a.articleID";
				sqlQuery.query(queryString, response, finishResponse);
				break;
			case "castVote":
				sqlQuery.logVote(action["data"],request.session.data.user,response,finishResponse);
				break;
			case "getUserVote":
				var queryString = "SELECT * FROM vote WHERE articleID = "+ action["data"]["articleID"] + " AND account = '" + request.session.data.user + "'";
				sqlQuery.query(queryString,response,finishResponse);
				break;
			case "getAllTags":
				if(action["data"]["searchString"] === "all")	{
					var queryString = "SELECT GROUP_CONCAT(tag.tag,';') AS tags FROM tag" + 
									" LEFT JOIN(" + 
									"SELECT * FROM userTag" + 
									" WHERE account = '" + request.session.data.user + "') userTags" + 
									" ON userTags.tag = tag.tag" + 
									" WHERE userTags.tag IS NULL";
									// console.log(queryString);
					sqlQuery.query(queryString,response,finishResponse);
				} else {
					
				}
				break;
			case "getUserTags":
				var queryString = "SELECT GROUP_CONCAT(tag,';') AS tags FROM userTag WHERE account = '" + request.session.data.user + "'";
				sqlQuery.query(queryString,response,finishResponse)
				break;
			case "linkUserWithTag":
				sqlQuery.linkUser(request.session.data.user,action["data"]["tag"],response,finishResponse_String);
				break;
			case "unlinkTagWithUser":
				var queryString = "DELETE from userTag WHERE account = '" + request.session.data.user + "' AND tag = '" +  action["data"]["tag"] + "'";
				sqlQuery.query(queryString,response,finishResponse);
				break;
			case "getSpecificTags":
				queryString = "SELECT GROUP_CONCAT(tag.tag,';') AS tags FROM tag" + 
									" LEFT JOIN(" + 
									"SELECT * FROM userTag" + 
									" WHERE account = '" + request.session.data.user + "') userTags" + 
									" ON userTags.tag = tag.tag" + 
									" WHERE userTags.tag IS NULL AND tag.tag like '%" + action["data"]["searchString"] + "%'";
				console.log(queryString);
				sqlQuery.query(queryString,response,finishResponse);
				break;
			case "userInterestsArticleRequest":
			var queryString = "SELECT a.title AS title, a.articleID AS articleID, a.submissionDate AS submissionDate, a.groupedTags as groupedTags, (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes " +  
							"FROM(" + 
							"SELECT article.articleID, article.title, article.submissionDate, article.author, groupedTags " + 
							"FROM(" + 
							"SELECT allTags.articleID, GROUP_CONCAT(allTags.tag,';') AS groupedTags " + 
							"FROM(" + 
							"SELECT tag " + 
							"FROM userTag " + 
							"WHERE account = '" + request.session.data.user + "') usersTags " + 
							"JOIN(" + 
							"SELECT * " + 
							"FROM articleTag) allTags " + 
							"ON usersTags.tag = allTags.tag " + 
							"GROUP BY allTags.articleID) userArticles " + 
							"JOIN article " + 
							"ON article.articleID = userArticles.articleID) a " + 
							"LEFT JOIN vote " + 
							"ON a.articleID = vote.articleID " + 
							"GROUP BY a.title, a.articleID, a.groupedTags " + 
							"ORDER BY a.submissionDate DESC";
			sqlQuery.query(queryString,response,finishResponse);

			default:
				break;
		}
		// console.log(action);
	    // response.writeHead(200);
	    // response.end("test");
	});

}

function finishResponse_String(err,response,body)	{
	console.log(body);
	response.writeHead(200);
	response.write(body);
    response.end();
}

function finishResponse(err,response,body)	{
	response.writeHead(200);
	console.log(body);
	var type = JSON.stringify(body);
	response.write(type);
    response.end();
}

function findType(extension)	{
	var type = types[extension];
	return type;
}

function fail(response, code) {
    response.writeHead(code);
    response.end();
}

start();
