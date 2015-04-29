SELECT a.title, a.articleID, a.submissionDate, a.groupedTags, (CAST(SUM(vote.upvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as upvotes, (CAST(SUM(vote.downvote) AS FLOAT)/ (SUM(vote.upvote) + SUM(vote.downvote))) * 100 as downvotes 
FROM( 
		SELECT article.articleID, article.title, article.submissionDate, article.author, groupedTags
		FROM(
			SELECT allTags.articleID, GROUP_CONCAT(allTags.tag,';') AS groupedTags
			FROM(
				SELECT tag 
				FROM userTag
				WHERE account = "benjiC") usersTags
			JOIN(
				SELECT * 
				FROM articleTag) allTags
			ON usersTags.tag = allTags.tag
			GROUP BY allTags.articleID) userArticles
		JOIN article
		ON article.articleID = userArticles.articleID) a 
LEFT JOIN vote 
ON a.articleID = vote.articleID 
GROUP BY a.title, a.articleID, a.groupedTags 
ORDER BY a.submissionDate DESC;




SELECT *
FROM(
	SELECT DISTINCT allTags.articleID
	FROM(
		SELECT tag 
		FROM userTag
		WHERE account = "benjiC") usersTags
	JOIN(
		SELECT * 
		FROM articleTag) allTags
	ON usersTags.tag = allTags.tag) userArticles
JOIN article
ON article.articleID = userArticles.articleID
GROUP BY article.title, article.articleID

