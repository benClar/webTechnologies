"use strict";

window.onload = function() {
  start(); 
};

var STATE_DISLIKE = 0;
var STATE_LIKE = 0;

//Changes element with ID equal to s1
function changeElement(elementID,content) {
   document.getElementById(elementID).innerHTML = content;
}

//Displays alert with content of p1
function displayAlert(content)	{
	window.alert(content);
}

//Compares specified input from specified element and prints specified output to specific element
function compareElement(inputElement, 
						comparison,
						outputElement,
						successOutputMessage,
						failureOutputMessage)	{
	if(document.getElementById(inputElement).value == comparison)	{
		changeElement(outputElement,successOutputMessage);
	} else {
		changeElement(outputElement,failureOutputMessage);
	}
}


function hideElement(elementID)	{
	document.getElementById(elementID).style.display = "none";
	//$("#elementID").hide();
	//$('#elementID').style.display = 'none';
}

function hideClass(classID)	{
	var divs = document.getElementsByClassName(classID);
	for(var i = 0; i < divs.length; i = i + 1) {
        divs[i].style.display="none";
    }
}

function showClass(classID)	{
	var divs = document.getElementsByClassName(classID);
	for(var i = 0; i < divs.length; i = i + 1) {
        divs[i].style.display="block";
    }
}

function transitionVerticlePosition(classID, FinalHeight)	{
	var divs = document.getElementsByClassName(classID);
	var b = 0;
	var opacityIncrement = (1/(FinalHeight/0.3));
	var opacity = 0;
	function delayedLoop () {           //  create a loop function
		setTimeout(function () {    //  call a 3s setTimeout when the loop is called
			divs[0].style.top= b + "%";
			console.log(opacity);
			opacity = opacity + opacityIncrement;
			divs[0].style.opacity = opacity;
			b = b + 0.3;                    //  increment the counter
			if (b <= FinalHeight) {            //  if the counter < 10, call the loop function
				delayedLoop();             //  ..  again which will trigger another 
			}                        //  ..  setTimeout()
		}, 1)
	}
	divs[0].style.opacity =1;
	delayedLoop();
}

function showElement(elementID)	{
	document.getElementById(elementID).style.display = "block";
}

function draw(elementID) {
  // get a reference to the <canvas> tag
  var canvas = document.getElementById(elementID);
 	// if the browser support canvas
 	if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    // Apply JavaScript APIs for drawing
 	}
 }

 function getWindowWidth() {
    return window.outerWidth;    
    //document.getElementById("demo").innerHTML = txt;
}

function getWindowHeight()	{
	return window.outerHeight;
}

function checkLessThan(comparison, value)	{
	if(value <= comparison)	{
		return true;
	} else	{
		return false;
	}
}

function changeNavigation()	{
	if(checkLessThan(740,getWindowWidth()))	{
		hideElement('wideNavBar');
		showElement('cssmenu');
	} else	{
		showElement('wideNavBar');
		hideElement('cssmenu');
	}
}

function start()	{
	var i = document.getElementById("dislike");
    i.addEventListener('click', function(e) {
        e.preventDefault();
		ToggleDislike();
     });

    document.getElementById("like").addEventListener('click',function(e)	{
        e.preventDefault();
		ToggleLike();
    });
}

function swap(element,image)	{
    element.style.backgroundImage = "url("+image+ ")";
}


function ToggleLike() {
  var el = document.getElementById('like');
  var dl = document.getElementById('dislike');
	el.classList.toggle('likeClicked');

	if(dl.classList.contains('dislikeClicked'))	{
  		dl.classList.toggle('dislikeClicked')
 	}
}

function ToggleDislike() {
  var el = document.getElementById('dislike');
  var l = document.getElementById('like');

	el.classList.toggle('dislikeClicked');

	if(l.classList.contains('likeClicked'))	{
		l.classList.toggle('likeClicked');
  	}
}

// document.getElementById('toggler').addEventListener('click', function() {
//   colorToggle();
// });








