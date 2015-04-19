"use strict"

var sql = require("sqlite3");
sql.verbose();
var ret = "";
var result = "";
var db;

function openDB()	{
	db = new sql.Database("./db/learnhistory.db");
}

function closeDB()	{
	db.close();
}


function query(queryString,response,callback)	{
	openDB();
	db.all(queryString, function(err, row) {
		console.log(row);
		callback(null,response,row);
	});
	closeDB();
	return result;
}

function addNewArticle(data, user, response,callback)	{
	openDB();
	formatTags(data);
	insertTags(data["tags"]);
	insertArticle(data,user);

	console.log(data);
	console.log(user);
}

function insertTags(tags)	{
	for(var i = 0; i < tags.length; i++)	{
		db.run("INSERT INTO tag VALUES (?)",tags[i],function(err, row) {
		if(err){

		}
		});
	}
	
}

function insertArticle(data, user)	{
	var submissionTime = new Date().getTime();
	console.log(data);
	db.run("INSERT INTO article(title, articleContent,submissionDate,author) VALUES (?,?,?,?)",[data['title'],data['articleBody'],submissionTime,user],function(err, row) {
	 	if(err){

	 	} else {
			db.all("SELECT articleID from article WHERE submissionDate = ?",[submissionTime], function(err,row)	{
				for(var i = 0; i < data["tags"].length; i++)	{
					db.run("INSERT INTO articleTag(articleID,tag) VALUES (?,?)",[row[0]["articleID"],data["tags"][i]])
				}
			});
		}
	});
}

function formatTags(data)	{
	data["tags"] = data["tags"].split(";");
	for(var i = 0; i < data["tags"].length; i++)	{
		data["tags"][i] = data["tags"][i].trim();
		if(data["tags"][i] == "")	{
			data["tags"].splice(i,1);
		}
	}
	return data;
}

function handleResult(err,rows)	{
	result = rows;
}

module.exports.query = query;
module.exports.addNewArticle = addNewArticle;