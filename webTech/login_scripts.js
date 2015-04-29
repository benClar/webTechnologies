addEventListener("load",function() {
     
});

var MINIMUM_USER_NAME_LENGTH = 6;
var MAXIMUM_USER_NAME_LENGTH = 20;
var MINIMUM_PASSWORD_LENGTH = 8;
var MAXIMUM_PASSWORD_LENGTH = 8;


function startLoginScripts()	{
	document.getElementById("newAccount_submit").addEventListener('click',function(e)	{
		var formElements = document.getElementById('newUser_form').elements;
		var data = {};
		for( var i = 0; i < formElements.length; i++)	{
			if(formElements[i].type != "button")	{
				data[formElements[i].name] = formElements[i].value;
			}
		}
		registrationFormValidation(data);
	});

	document.getElementById("login_submit").addEventListener('click',function(e)	{
		var data = getFormData(document.getElementById('login_form').elements);
		login(data['existingUsername'],data['existingPassword']);
	});
}



function getFormData(formElements)	{
	data = {};
	for( var i = 0; i < formElements.length; i++)	{
		if(formElements[i].type != "button")	{
			data[formElements[i].name] = formElements[i].value;
		}
	}
	return data;
}

function createAccount(data, result)	{
	if(result == true)	{
		create_new_account(data);
	} else {
		setError("newUserName_error","Username Not Unique")
	}
}

function registrationFormValidation(data)	{
	if(validatePassword(data["newPassword"]) && validateEmail(data["newEmail"]) && validateNewUsername(data["newUserName"]))	{
		serverValidation(data,createAccount);
		return true;
	}
	return false;
}

function serverValidation(data)	{
	checkUsernameUnique(data,createAccount);
}

function validateEmail(email)	{

	if(email.length == 0)	{
		return true;
	}

	if(!email.match(/@[a-z]/))	{
		setError("newEmail_error","Not a valid email");
		return false;
	}
	setError("newEmail_error","");
	return true;
}


function validatePassword(pw)	{
	if(pw.length < 8)	{
		setError("newPassword_error","Password must be longer than 8 characters");
		return false;
	}

	if(!pw.match(/\W+/))	{
		setError("newPassword_error","Password needs one special character");
		return false;
	}


	if(!pw.match(/\d/))	{
		setError("newPassword_error","Password needs one number");
		return false;
	}

	if(!pw.match(/[a-z]/))	{
		setError("newPassword_error","Password needs one letter");
		return false;
	}

	setError("newPassword_error","");
	return true;
}

function validateNewUsername(name)	{
	if(name.length < MINIMUM_USER_NAME_LENGTH)	{
		setError("newUserName_error","Name must be longer than 6 characters")
		return false;
	}

	if(name.length > MAXIMUM_USER_NAME_LENGTH)	{
		setError("newUserName_error","Name must be longer than 6 characters")
		return false;
	}

	if(!name.match(/^[0-9a-zA-Z]+$/))	{
		setError("newUserName_error","Name must have no special characters")
		return false;
	}

	setError("newUserName_error","");
	return true;
}



