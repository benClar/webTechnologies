// Start of params module
params();
function params() {
"use strict";
addEventListener("load", display);

// Unpack and display the parameters
function display() {
    // var para = document.querySelector("#message");
    // var message = para.firstChild;
    var value;
    var url = location.href;
    var parts = url.split("?");
    // if (parts.length < 2)
    // {
    //     message.data = "No parameters found.";
    //     return;
    // }
    var paramstring = parts[1];
    var params = paramstring.split("&");
    // message.data = "Parameters found:";
    // var list = document.querySelector("#list");
    var content = "";
    for (var i = 0; i < params.length; i++)
     {
         var def = params[i].split("=");
         var name = def[0];
        switch(name)    {
            case "ArticleTitleBox":
                value = cleanUpString(def[1]);
                document.getElementById("text").innerHTML = value;
                break;
            case "TagBox":
                value = cleanUpString(def[1]).split(";");
                document.getElementById("InArticle_ArticleKeyWords").innerHTML = generateTags(value);
                break;
            case "ArticleBodyBox":
                value = "<p>" + cleanUpString(def[1]) + "</p>";
                console.log(value);
                document.getElementById("ArticleBodyContent").innerHTML = value; 
                break;
            default: 
                return;
        }
         //content += "<li>" + name + " = " + value + "</li>";
     }
    
    // list.innerHTML = content;
}

function generateTags(tags) {
    var output;
    for( var i = 0; i < tags.length; i++)   {
        output += "<li class='keywordItem'><a class='keywordHyper' href='none.asp'>" + tags[i] + "</a></li>";
    }

    return output;
}

function cleanUpString(param)   {
    var cleaned = param.replace(/\+/g," ");
    cleaned = cleaned.replace(/\%0D/g,"</p> <br/> <p>");
    return decodeURIComponent(cleaned);
    
}


// End of params module
}