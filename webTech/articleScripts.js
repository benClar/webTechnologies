"use strict";

var articleID;



addEventListener("load",function() {
    start();
    startLoginScripts();
    aStart();
});



function aStart()	{
    document.getElementById("dislike").addEventListener('click', function(e) {
        voteClick("dislike",articleID,showLogin,e);
     });

    document.getElementById("like").addEventListener('click',function(e)	{
        voteClick("like",articleID,showLogin,e);
    });

    loadArticleContent();

}

function loadArticleContent() {
    var value;
    var url = location.href;
    var parts = url.split("?");
    articleID = parts[1].split("=")[1]
    generateArticle(articleID,setLoginInterface);
}

function ToggleLike() {
  var el = document.getElementById('like');
  var dl = document.getElementById('dislike');
  el.classList.toggle('likeClicked');

    if(dl.classList.contains('dislikeClicked')) {
        dl.classList.toggle('dislikeClicked')
    }
}

function ToggleDislike() {
  var el = document.getElementById('dislike');
  var l = document.getElementById('like');

    el.classList.toggle('dislikeClicked');

    if(l.classList.contains('likeClicked')) {
        l.classList.toggle('likeClicked');
    }
}