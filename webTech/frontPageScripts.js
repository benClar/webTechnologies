"use strict";

addEventListener("load",function() {
    startArticleScripts(); 
});

function startArticleScripts()	{
	document.getElementById("nextArticleAll").addEventListener('click',function(e)	{
		getArticles("next","AllContent");
	});

	document.getElementById("prevArticleAll").addEventListener('click',function(e)	{
		getArticles("prev","AllContent");
	});
	document.getElementById("nextArticleNew").addEventListener('click',function(e)	{
		getArticles("next","NewContent");
	});
	document.getElementById("prevArticleNew").addEventListener('click',function(e)	{
		getArticles("prev","NewContent");
	});
	document.getElementById("nextArticleControversial").addEventListener('click',function(e)	{
		getArticles("next","ControversialContent");
	});

	document.getElementById("prevArticleControversial").addEventListener('click',function(e)	{
		getArticles("prev","ControversialContent");
	});
}