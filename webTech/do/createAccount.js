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
	// console.log(username);
	// console.log(password);
	// console.log(email);
	var hash = crypto.createHash('sha512');
	var salt = generateSalt();
	hash.update(password + salt);
	var hashedPassword = hash.digest('hex');
	// console.log(hashedPassword);
	db.run("INSERT INTO user VALUES (?, ?)",[username,email]);
	db.run("INSERT INTO password VALUES (?, ?, ?)",[hashedPassword,salt, username]);
	// validateAccount("sarahWood","benji101290!",compareAccount)
	closeDB();
}

function validateAccount(username,password,response,callback)	{
	openDB();
	var hash = crypto.createHash('sha512');
	db.all("SELECT * FROM password WHERE account = ?",username,function(err, rows) {
		try {
			hash.update(password + rows[0]['salt']);
			var enteredPW = hash.digest('hex')
			if(err)	{
				var body = '{"response":"passwordValidation", "data": { "passwordMatched": salse} }';
				callback(null,response,body);
			} else if(enteredPW == rows[0]['password'])	{
				var body = '{"response":"passwordValidation", "data": { "passwordMatched": true} }';
				return callback(null,response,body);
			} else {
				var body = '{"response":"passwordValidation", "data": { "passwordMatched": false} }';
				callback(null,response,body);
			}
		} catch (err)	{
			var body = '{"response":"passwordValidation", "data": { "passwordMatched": false} }';
			callback(null,response,body);	
		}

	});
	closeDB();
}

module.exports.createAccounts = createAccounts;
module.exports.validateAccount = validateAccount;
