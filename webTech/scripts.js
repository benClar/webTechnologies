"use strict";

addEventListener("load",function() {
    start(); 
    hideElement('cssmenu');
});

var goTo_clickState = 0;

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
    document.getElementById("goToText").addEventListener('click',function(e)	{
    	e.preventDefault();
    	if(goTo_clickState == 0)	{
    		turnGoToStyleOn();
    	}
    });

    document.getElementById("goToClose").addEventListener('click',function(e)	{
    	e.preventDefault();
    	if(goTo_clickState == 1)	{
    		turnGoToStyleOff();
    	}
    });

    document.getElementById("logInNav").addEventListener('click',function(e)	{
    	showClass('blurBackground');
    	showClass('LogIn');
    	transitionVerticlePosition('LogIn','10');
    });

    document.getElementById("closeLogin").addEventListener('click',function(e)	{
    	hideClass('LogIn'); 
    	hideClass('blurBackground');
    });

    document.getElementById("topTagsLeftNav").addEventListener('click',function(e)	{
    	hideElement('LeftNavBarContent_MostRecent'); 
    	showElement('LeftNavBarTop');
    });
    document.getElementById("mostRecentTagsLeftNav").addEventListener('click',function(e)	{
    	hideElement('LeftNavBarTop'); 
    	showElement('LeftNavBarContent_MostRecent');
    });
    window.addEventListener('resize',function(e)	{
    	changeNavigation();
    });
}

function swap(element,image)	{
    element.style.backgroundImage = "url("+image+ ")";
}

function turnGoToStyleOn()	{
		goTo_clickState++;
		console.log(goTo_clickState);
		document.getElementById('goToClose').style.display = "block";
		document.getElementById('goTo').classList.toggle('goToClick');
}

function turnGoToStyleOff()	{
	goTo_clickState--;
	document.getElementById('goToClose').style.display = "none";
	document.getElementById('goTo').classList.toggle('goToClick');
}








