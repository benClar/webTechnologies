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

function getArticleList(queryString,boundary,type,response,callback)	{
	openDB();
	db.all(queryString, function(err, row) {
		var result = getRows(type,row,boundary);
		if(result.length == 0)	{
			callback(null,response,"none");
		} else	{
			callback(null,response,result);
		}
	});
	closeDB();	
}

function linkUser(username,tag,response,callback)	{
	openDB();
	db.all("SELECT * FROM userTag WHERE account = ? AND tag = ?",[username,tag],function(err,row){
		if(row.length == 0)	{
			db.all("INSERT INTO userTag(account,tag) VALUES(?,?)",[username,tag],function(err,row){
				callback(null,response,"accountLInked");
			});
		} else	{
			callback(null,response,"noAction");
		}
	});
	
	closeDB();
}

function getRows(type,row,boundary)	{
	result =[];
	console.log("BOUNDARY" + boundary);
	if(type === "prev")	{
		// console.log("Boundary  " + boundary);
		// console.log("Start row " + (parseInt(boundary) - 10));
		// console.log("result length: " + row.length)
		for(var curr = parseInt(boundary) - 20; (curr < parseInt(boundary - 10)) && (curr < row.length) && (curr >= 0); curr++ )	{
			console.log(curr);
			result.push(row[curr]);
			// console.log(row[curr]);
		}
	} else if (type === "next" || type === "curr")	{
		for(var curr = boundary, boundary = parseInt(boundary) + 10 ; curr < boundary && curr < row.length; curr++ )	{
			// console.log("boundary: " + boundary);
			// console.log("article: " + curr);
			result.push(row[curr]);
		}
	}
	return result;
}

function addNewArticle(data, user, response,callback)	{
	openDB();
	// console.log("HERE2");
	formatTags(data);
	insertTags(data["tags"],0,data,user,response,callback);
	// insertArticle(data,user);

	// console.log(data);
	// console.log(user);
	closeDB();
}

function logVote(data,user,response,callback)	{
	// console.log(data);
	openDB();
		db.all("SELECT * FROM vote WHERE articleID = ? AND account = ?",[data["articleID"],user], function(err, row) {
		if(row.length > 0)	{
			// console.log(row);
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
				// console.log("LIKE VOTE IS:");
				results["upvote"] = (1 + results["upvote"]) % 2;
				// console.log(results["upvote"]);
				// console.log(user);
				// console.log(results["articleID"]);
				db.all("UPDATE vote SET upvote=? WHERE articleID=? AND account = ?",[results["upvote"], results["articleID"],user], function(err,row){
					cleanUpVotes(data,results,user,response,callback);
				});
				break;
			case "dislike":
				// console.log("DISLIKE VOTE IS:");
				results["downvote"] = (1 + results["downvote"]) % 2;
				// console.log(results["downvote"]);
				// console.log(user);
				// console.log(results["articleID"]);
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
		getPercentageVotes(results["articleID"],response,callback);
	});
}

function getPercentageVotes(articleID,response,callback)	{
	db.all("SELECT (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes FROM vote WHERE articleID = ?",[articleID],function(err,row){
		if(row.length>0)	{
			callback(null,response,row[0]);
		}	else	{
			row = { upvotes: 50, downvotes: 50 };
			callback(null,response,row);
		}
	});
}

function insertTags(tags,tagNum, data,user,response, callback)	{
	if(tagNum == tags.length)	{
		insertArticle(data,user,response,callback);
		return;
	}

	db.run("INSERT INTO tag VALUES (?)",tags[tagNum],function(err, row) {
		if(err){
			
		}
		insertTags(tags,tagNum + 1, data,user,response, callback);
	});
}

function insertArticle(data, user, response, callback)	{
	var submissionTime = new Date().getTime();
	db.run("INSERT INTO article(title, articleContent,submissionDate,author) VALUES (?,?,?,?)",[data['title'],data['articleBody'],submissionTime,user],function(err, row) {
	 	if(err){

	 	} else {
			db.all("SELECT articleID from article WHERE submissionDate = ?",[submissionTime], function(err,row)	{
				linkArticles(row, data, 0, response, callback)
			});
		}
	});
}

function linkArticles(rows, data, tagNumber, response, callback)	{
	if(tagNumber == data["tags"].length)	{
		var articleID = '{"articleID":"' + rows[0]["articleID"] + '"}';
		callback(null,response,articleID);
		return;
	}
	db.all("INSERT INTO articleTag(articleID,tag) VALUES (?,?)",[rows[0]["articleID"],data["tags"][tagNumber]], function(err,row)	{
		linkArticles(rows, data, tagNumber + 1, response, callback);
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
module.exports.linkUser = linkUser;