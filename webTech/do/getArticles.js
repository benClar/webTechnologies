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
		callback(null,response,row);
	});
	closeDB();
	return result;
}

function handleResult(err,rows)	{
	result = rows;
}

module.exports.query = query;