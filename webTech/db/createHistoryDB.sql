CREATE TABLE user(
	account VARCHAR(20) PRIMARY KEY NOT NULL,
	email VARCHAR(40)
);

CREATE TABLE password(
	password BLOB NOT NULL,
	salt BLOB NOT NULL,
	account VARCHAR(20) NOT NULL,
	FOREIGN KEY(account) REFERENCES user ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE article(
	title VARCHAR(50) NOT NULL,
	articleID INTEGER PRIMARY KEY AUTOINCREMENT,
	articleContent TEXT(2000),
	submissionDate DATE,
	author VARCHAR(20) NOT NULL,
	FOREIGN KEY(author) REFERENCES user ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tag(
	tag VARCHAR(20) PRIMARY KEY NOT NULL
);

CREATE TABLE articleTag(
	articleID INTEGER NOT NULL,
	tag VARCHAR(20) NOT NULL,
	FOREIGN KEY(articleID) REFERENCES article ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(tag) REFERENCES tag ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE vote(
	upvote INTEGER NOT NULL,
	downvote INTEGER NOT NULL,
	articleID INTEGER NOT NULL,
	account VARCHAR(20) NOT NULL,
	FOREIGN KEY(articleID) REFERENCES article ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(account) REFERENCES user ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE userTag(
	account VARCHAR(20) NOT NULL,
	tag VARCHAR(20) NOT NULL,
	FOREIGN KEY(account) REFERENCES user ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(tag) REFERENCES tag on DELETE CASCADE ON UPDATE CASCADE
)

-- INSERT INTO tag(tag)
-- VALUES("WW2"),
-- 	("War"),
-- 	("Conflict"),
-- 	("US Presidents"),
-- 	("USA"),
-- 	("Civil Rights");

-- INSERT INTO article (title, articleContent, author, submissionDate)
-- VALUES("Why WW2 Ended",
-- 	"This is the content of my test article.  This article is about why WW2 ended.",
-- 	"bclarke",
-- 	"2015-04-05"),
-- 	("The Election of Preseident Obama",
-- 	"This is the content of my test article.  This article is about the Election of President Obama",
-- 	"bclarke",
-- 	"2015-04-05");

-- INSERT INTO articleTag(articleID,tag)
--  VALUES("1","WW2"),
--  	("1","War"),
--  	("1","Conflict"),
--  	("2","USA"),
--  	("2", "US Presidents"),
--  	("2", "Civil Rights");

 -- INSERT INTO vote(upvote,downvote, articleID, account)
 -- VALUES("1","0","1","benjiC"),
 -- 	("1","0","1","swood"),
 -- 	("1","0","2","swood"),
 -- 	("0","1","2","benjiC");
