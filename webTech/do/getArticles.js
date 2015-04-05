"use strict"

var sql = require("sqlite3");
sql.verbose();
var ret = "";
var result = "";
function query(queryString,response,callback)	{
	var db = new sql.Database("./db/history.db");
		db.all(queryString, function(err, row) {
			callback(null,response,row);
		});
		db.close();
	return result;
}

function handleResult(err,rows)	{
	result = rows;
}

// query();

// var queryGetAll = 'SELECT id, title, description, modified, lat, lng, zoom FROM maps';
// function Manager(){
//         this.db = null;
//         // Allow a callback function to be passed to getAll
//         this.getAll = function(callback){
//             this.db.all(queryGetAll, function(err, rows){
//                 if (err){
//                     // call your callback with the error
//                     callback(err);
//                     return;
//                 }
//                 // call your callback with the data
//                 callback(null, rows);
//                 return;
//             });
//         }
// }







module.exports.query = query;