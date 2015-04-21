"use strict"

var http = require('http');
var fs = require('fs');
var net = require('net');
var sqlQuery = require("./do/getArticles.js");
var accounts = require("./do/createAccount.js");
var https = require('https');
var tls = require('tls')
var session = require('sesh/lib/core').session;


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
	console.log(url);
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


function serve(request,response)	{
	session(request, response, function(request, response){

		console.log(request.session.data.user);
		var url = require('url').parse(request.url); //Take a URL string, and return an object.
		var new_url;

		if((new_url = needs_redirect(request))) { 
			return redirect(response,new_url);
		}

		switch(request["headers"]["content-type"])	{
			case "application/x-www-form-urlencoded":
				return formRequest(request, response);
				break;
			default:
				break;
		}

		var filename = url.pathname.substring(1);
		if(!filename.length) filename = "index.html";
		var type = findType(filename.substring(filename.lastIndexOf(".") + 1));
		if(!type) return fail(response,http.STATUS_CODES["404"]);
		
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
	// 
	console.log("new request");
	//only run when all POST data has been recieved
	request.on('end', function () {
		action = JSON.parse(body);
		switch(action["request"])	{
			case "articleRequest":
				var queryString = "SELECT a.title, a.articleID, a.groupedTags, (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes FROM( SELECT article.title, article.articleID, GROUP_CONCAT(articleTag.tag,';') as groupedTags FROM article JOIN articleTag ON article.articleID = articleTag.articleID WHERE article.articleID > "+ action["data"]["index"] + " AND article.articleID < " + (parseFloat(action["data"]["index"]) + 10 + " GROUP BY article.articleID, article.title) a LEFT JOIN vote ON a.articleID = vote.articleID GROUP BY a.title, a.articleID, a.groupedTags ORDER BY a.articleID");
				sqlQuery.query(queryString, response, finishResponse);
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
				sqlQuery.addNewArticle(action["data"],request.session.data.user,response,finishResponse_String);
				break;
			case "loadArticle":
				var queryString = "SELECT a.title, a.articleContent, a.groupedTags, (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes FROM( SELECT article.title, article.articleContent, article.articleID, GROUP_CONCAT(articleTag.tag,';') as groupedTags FROM article JOIN articleTag ON article.articleID = articleTag.articleID WHERE article.articleID =" + action["data"]["articleID"] + ") a LEFT JOIN vote ON a.articleID = vote.articleID GROUP BY a.title, a.articleID, a.groupedTags ORDER BY a.articleID";
				sqlQuery.query(queryString, response, finishResponse);
				break;
			case "castVote":
				sqlQuery.logVote(action["data"],request.session.data.user,response,finishResponse);
				break;
			default:
				break;
		}
		// console.log(action);
	    // response.writeHead(200);
	    // response.end("test");
	});

}

function finishResponse_String(err,response,body)	{
	response.writeHead(200);
	response.write(body);
    response.end();
}

function finishResponse(err,response,body)	{
	console.log("SUCESS");
	response.writeHead(200);
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
