addEventListener("load",function() {
    startSubPageScripts(); 
});

articleIndex

var CURRENT_NEW_LIMIT = 10;
var CURRENT_CONTROVERSIAL_LIMIT = 10;

function startSubPageScripts()	{
	 var url = location.href;
    var parts = url.split("?");
    var subPageTag = parts[1].split("=")[1]

	document.getElementById("nextArticleNew").addEventListener('click',function(e)	{
		getArticles("next","NewContent",subPageTag);
	});
	document.getElementById("prevArticleNew").addEventListener('click',function(e)	{
		getArticles("prev","NewContent",subPageTag);
	});
	document.getElementById("nextArticleControversial").addEventListener('click',function(e)	{
		getArticles("next","ControversialContent",subPageTag);
	});

	document.getElementById("prevArticleControversial").addEventListener('click',function(e)	{
		getArticles("prev","ControversialContent",subPageTag);
	});
}