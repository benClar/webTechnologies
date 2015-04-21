"use strict";

// addEventListener('load',function() {

//     aStart(); 
// });
var articleID;

document.addEventListener("load",aStart())

// function addLoadEvent(func) {
//   var oldonload = window.onload;
//   if (typeof window.onload != 'function') {
//     window.onload = func;
//   } else {
//     window.onload = function() {
//       if (oldonload) {
//         oldonload();
//       }
//       func();
//     }
//   }
// }

// addLoadEvent(aStart());



function aStart()	{
    document.getElementById("dislike").addEventListener('click', function(e) {
        voteClick("dislike",articleID,showLogin,e);
        console.log(articleID);
     });

    document.getElementById("like").addEventListener('click',function(e)	{
        voteClick("like",articleID,showLogin,e);
        console.log(articleID);
    });

    loadArticleContent()

}

function loadArticleContent() {
    var value;
    var url = location.href;
    var parts = url.split("?");
    articleID = parts[1].split("=")[1]
    generateArticle(articleID);
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