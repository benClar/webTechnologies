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
		// console.log(row);
		callback(null,response,row);
	});
	closeDB();
	return result;
}

function getArticleList(queryString,upperBoundary,response,callback)	{
	openDB();
	db.all(queryString, function(err, row) {
		result =[];
		for(var start = upperBoundary - 10; start < upperBoundary && start < row.length; start++ )	{
			console.log(start);
			console.log(row[start]);
			result.push(row[start]);
		}
		console.log(result.length);
		if(result.length == 0)	{
			callback(null,response,"none");
		} else	{
			callback(null,response,result);
		}
	});
	closeDB();	
}

function addNewArticle(data, user, response,callback)	{
	openDB();
	formatTags(data);
	insertTags(data["tags"]);
	insertArticle(data,user);

	console.log(data);
	console.log(user);
	closeDB();
}

function logVote(data,user,response,callback)	{
	console.log(data);
	openDB();
		db.all("SELECT * FROM vote WHERE articleID = ? AND account = ?",[data["articleID"],user], function(err, row) {
		if(row.length > 0)	{
			console.log(row);
			resetVote(data,row[0], user,response,callback);
		} else	{
			newVote(data,row, user,response,callback);
		}
		
	});
	closeDB();
}

function newVote(data,row, user,response,callback)	{
	switch(data["voteType"])	{
		case "like":
			db.all("INSERT INTO vote (upvote,downvote,articleID,account) VALUES(?,?,?,?)",[1,0,data["articleID"],user],function(err,row)	{
				getPercentageVotes(data["articleID"],response,callback);
			});
			break;
		case "dislike":
			db.all("INSERT INTO vote (upvote,downvote,articleID,account) VALUES(?,?,?,?)",[0,1,data["articleID"],user],function(err,row)	{
				getPercentageVotes(data["articleID"],response,callback);
			});
			break;
		default:
			break;	
	}

}

function resetVote(data,results, user,response,callback)	{
	db.all("UPDATE vote SET upvote=0, downvote=0 WHERE articleID=? AND account = ?",[data["articleID"],user],function(err,row)	{
		updateVote(data,results, user,response,callback);
	});
}

function updateVote(data,results, user,response,callback)	{
		switch(data["voteType"])	{
			case "like":
				console.log("LIKE VOTE IS:");
				results["upvote"] = (1 + results["upvote"]) % 2;
				console.log(results["upvote"]);
				console.log(user);
				console.log(results["articleID"]);
				db.all("UPDATE vote SET upvote=? WHERE articleID=? AND account = ?",[results["upvote"], results["articleID"],user], function(err,row){
					cleanUpVotes(data,results,user,response,callback);
				});
				break;
			case "dislike":
				console.log("DISLIKE VOTE IS:");
				results["downvote"] = (1 + results["downvote"]) % 2;
				console.log(results["downvote"]);
				console.log(user);
				console.log(results["articleID"]);
				db.all("UPDATE vote SET downvote=? WHERE articleID=? AND account = ?",[results["downvote"], results["articleID"],user],function(err,row){
					cleanUpVotes(data,results,user,response,callback);
				});
				break;
			default:
				break;
		}
}

function cleanUpVotes(data,results, user,response,callback)	{
	db.run("DELETE FROM vote WHERE upvote=0 AND downvote=0;",function(err,row)	{
		console.log("HERE:")
		console.log(results);
		getPercentageVotes(results["articleID"],response,callback);
	});
}

function getPercentageVotes(articleID,response,callback)	{
	console.log(articleID);
	db.all("SELECT (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes FROM vote WHERE articleID = ?",[articleID],function(err,row){
		if(row.length>0)	{
			callback(null,response,row[0]);
		}	else	{
			row = { upvotes: 50, downvotes: 50 };
			callback(null,response,row);
		}
	});
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
module.exports.logVote = logVote;
module.exports.getArticleList = getArticleList;