"use strict"

var sql = require("sqlite3");
var crypto = require('crypto');

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

function generateSalt()	{
	return crypto.randomBytes(32).toString('hex');
}

function createAccounts(username,password,email)	{
	openDB();
	var hash = crypto.createHash('sha512');
	var salt = generateSalt();
	hash.update(password + salt);
	var hashedPassword = hash.digest('hex');
	db.run("INSERT INTO user VALUES (?, ?)",[username,email]);
	db.run("INSERT INTO password VALUES (?, ?, ?)",[hashedPassword,salt, username]);
	// validateAccount("sarahWood","benji101290!",compareAccount)
	closeDB();
}

function validateAccount(username,password,response,callback)	{
	openDB();
	var hash = crypto.createHash('sha512');
	db.all("SELECT * FROM password WHERE account = ?",username,function(err, rows) {
		hash.update(password + rows[0]['salt']);
		var enteredPW = hash.digest('hex')
		if(enteredPW == rows[0]['password'])	{
			var body = '{"response":"passwordValidation", "data": { "passwordMatched": true} }'
			callback(null,response,body);
		} else {
			var body = '{"response":"passwordValidation", "data": { "passwordMatched": false} }'
			callback(null,response,body);
		}

	});
	closeDB();
}

function compareAccount(err,rows)	{
	console.log("TEEEEEEEEST" + username);
	console.log(rows);
}

module.exports.createAccounts = createAccounts;
module.exports.validateAccount = validateAccount;