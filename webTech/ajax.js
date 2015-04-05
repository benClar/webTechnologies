"use strict"

var articleData = {
	'AllContent': 0,
	'NewContent': 0,
	'ControversialContent':0
};

var ARTICLES_PER_PAGE = 10;


function getArticles(type,target) {

  var xmlhttp;
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      page += 10;
      var output = JSON.parse(xmlhttp.responseText);
      console.log(output[0]["articleID"]);
      document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
  }
  xmlhttp.open("POST","http://localhost:8000/",true);
  xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
  xmlhttp.send('articleRequest=' + articleData[target]);

}

function formatQuery(type, target)	{

	switch(type)	{
		case "next":
			articleData[target] += ARTICLES_PER_PAGE;
			break;
		case "prev":
			if(articleData[target] > 0)	{
				articleData[target] -= ARTICLES_PER_PAGE;
			}
			break;
		default:
			break;

	}

}


