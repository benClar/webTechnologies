"use strict";

addEventListener("load",function() {
    startArticleScripts(); 
});

function startArticleScripts()	{
	document.getElementById("nextArticleAll").addEventListener('click',function(e)	{
		getArticles("next","AllContent")
	}
function startArticleScripts()	{
	document.getElementById("prevArticleAll").addEventListener('click',function(e)	{
		getArticles("prev","AllContent")
	}
function startArticleScripts()	{
	document.getElementById("nextArticleNew").addEventListener('click',function(e)	{
		getArticles("next","NewContent")
	}
function startArticleScripts()	{
	document.getElementById("prevArticleNew").addEventListener('click',function(e)	{
		getArticles("prev","NewContent")
	}
function startArticleScripts()	{
	document.getElementById("nextArticleControversial").addEventListener('click',function(e)	{
		getArticles("next","ControversialContent")
	}
function startArticleScripts()	{
	document.getElementById("prevArticleControversial").addEventListener('click',function(e)	{
		getArticles("prev","ControversialContent")
	}
}