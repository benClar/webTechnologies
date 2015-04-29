"use strict";

addEventListener("load",function() {
	start();
    startArticleScripts(); 
    startLoginScripts();
});

var articleData = {
	'NewContent': 0,
	'ControversialContent':0,
	'yourInterestsContent':0
};

function startArticleScripts()	{
	var url = location.href;
    var parts = url.split("?");
    var subPageTag = parts[1].split("=")[1]
    console.log(url);
	getArticles("next","NewContent",subPageTag,articleData,setLoginInterface);

	document.getElementById("nextArticleNew").addEventListener('click',function(e)	{
		getArticles("next","NewContent",subPageTag,articleData);
		console.log(articleData["NewContent"]);
	});

	document.getElementById("prevArticleNew").addEventListener('click',function(e)	{
		getArticles("prev","NewContent",subPageTag,articleData);
		console.log(articleData["NewContent"]);
	});

	document.getElementById("nextArticleControversial").addEventListener('click',function(e)	{
		getArticles("next","ControversialContent",subPageTag,articleData);
		console.log(articleData["ControversialContent"]);
	});

	document.getElementById("prevArticleControversial").addEventListener('click',function(e)	{
		getArticles("prev","ControversialContent",subPageTag,articleData);
		console.log(articleData["ControversialContent"]);
	});

	document.getElementById("nextArticleControversial").addEventListener('click',function(e)	{
		getArticles("next","yourInterestsContent",subPageTag,articleData);
		console.log(articleData["ControversialContent"]);
	});

	document.getElementById("prevArticleControversial").addEventListener('click',function(e)	{
		getArticles("prev","yourInterestsContent",subPageTag,articleData);
		console.log(articleData["ControversialContent"]);
	});

	document.getElementById("tab2").addEventListener('click',function(e)	{
		getArticles("curr","ControversialContent",subPageTag,articleData);
	});

	document.getElementById("tab_3").addEventListener('click',function(e)	{
		getArticles("curr","yourInterestsContent",subPageTag,articleData);
	});
}