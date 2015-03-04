"use strict";

addEventListener('load',function() {
    aStart(); 
});

function aStart()	{
    document.getElementById("dislike").addEventListener('click', function(e) {
        e.preventDefault();
		ToggleDislike();
     });

    document.getElementById("like").addEventListener('click',function(e)	{
      e.preventDefault();
		  ToggleLike();
    });
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