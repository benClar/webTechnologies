addEventListener("load",function() {
	start();
    startSubPageScripts(); 
    startLoginScripts();
});

var articleData = {
	'NewContent': 0,
	'ControversialContent':0
};

function startSubPageScripts()	{
	var url = location.href;
    var parts = url.split("?");
    var subPageTag = parts[1].split("=")[1]

    getArticles("next","NewContent",subPageTag,articleData,setLoginInterface);

	document.getElementById("nextArticleNew").addEventListener('click',function(e)	{
		getArticles("next","NewContent",subPageTag,articleData);
	});
	document.getElementById("prevArticleNew").addEventListener('click',function(e)	{
		getArticles("prev","NewContent",subPageTag,articleData);
	});
	document.getElementById("nextArticleControversial").addEventListener('click',function(e)	{
		getArticles("next","ControversialContent",subPageTag,articleData);
	});

	document.getElementById("prevArticleControversial").addEventListener('click',function(e)	{
		getArticles("prev","ControversialContent",subPageTag,articleData);
	});
}