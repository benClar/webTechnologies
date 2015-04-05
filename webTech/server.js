"use strict"

var http = require('http');
var fs = require('fs');
var net = require('net');
var sqlQuery = require("./do/getArticles.js");

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

var httpServer = new http.Server();
var body="";
httpServer.listen(8000);
//Each http request
httpServer.on("request",function (request, response)	{
	var url = require('url').parse(request.url); //Take a URL string, and return an object.
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

//https://docs.nodejitsu.com/articles/HTTP/servers/how-to-read-POST-data
function formRequest(request, response)	{
	var body ="";
	var action;
	request.on('data', function (chunk) {
		 body += chunk; //Waiting to recieve all of POST data
	});
	// 

	 
	//only run when all POST data has been recieved
	request.on('end', function () {
		action = body.split('=');
		switch(action[0])	{
			case "articleRequest":
				sqlQuery.query("SELECT * from articles", response, finishResponse);
				break;
			default:
				break;
		}
		console.log(action[0]);
	    // response.writeHead(200);
	    // response.end(body);
	});

}

function finishResponse(err,response,body)	{
	// console.log(body);
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

