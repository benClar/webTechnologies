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

function showElement(elementID)	{
	document.getElementById(elementID).style.display = "inline";
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