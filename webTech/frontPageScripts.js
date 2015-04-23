"use strict";

addEventListener("load",function() {
    startArticleScripts(); 
});

var articleData = {
	'NewContent': 10,
	'ControversialContent':10
};

function startArticleScripts()	{
	getArticles("next","NewContent","all",articleData);

	document.getElementById("nextArticleNew").addEventListener('click',function(e)	{
		getArticles("next","NewContent","all",articleData);
		console.log(articleData["NewContent"]);
	});
	document.getElementById("prevArticleNew").addEventListener('click',function(e)	{
		getArticles("prev","NewContent","all",articleData);
		console.log(articleData["NewContent"]);
	});
	document.getElementById("nextArticleControversial").addEventListener('click',function(e)	{
		getArticles("next","ControversialContent","all",articleData);
		console.log(articleData["ControversialContent"]);
	});

	document.getElementById("prevArticleControversial").addEventListener('click',function(e)	{
		getArticles("prev","ControversialContent","all",articleData);
		console.log(articleData["ControversialContent"]);
	});

	document.getElementById("tab2").addEventListener('click',function(e)	{
		getArticles("curr","ControversialContent","all",articleData);
	});

}