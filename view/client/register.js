var REGISTER = '/client/register';
var myreg =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

function register()
{
	var form = document.getElementById('form');
	var error = document.getElementById('error');
	var name = form.elements['name'].value;
	var mail = form.elements['mail'].value;
	var phone = form.elements['phone'].value;
	var password = form.elements['password'].value;
	var password2 = form.elements['password2'].value;
	var avatar = form.elements['avatar'].value;
	var sex = form.elements['sex']['1'].checked;
	var birthday = form.elements['birthday'].value;

	if(!name || name.length > 50)
	{
		error.innerHTML = 'Name is empty or too large';
		return;
	}

	if(!mail || !myreg.test(mail))
	{
		error.innerHTML = 'Mail is empty or illegal';
		return;
	}

	if(!phone || phone.length != 11)
	{
		error.innerHTML = 'Phone is empty or illegal';
		return;
	}

	if(!password || password.length < 6 || password.length > 16)
	{
		error.innerHTML = 'Password is empty, too short or too long';
		return;
	}

	if(password != password2)
	{
		error.innerHTML = 'Password is different from password2';
		return;
	}

	error.innerHTML = '';

	var post = 
	{
		name : name,
		mail : mail,
		phone : phone,
		password : password,
		avatar : avatar,
		sex : sex,
		birthday : birthday
	}
	console.log(post);

	var request = new XMLHttpRequest();
	request.open('POST', window.location.origin+REGISTER, false);
	request.send(JSON.stringify(post));
	var result = document.getElementById('result');
	if(request.status == 201)
	{
		result.innerHTML = 'Register Succeed! Welcome!';
		console.log(window.location.href);
		alert('Register Succeed!');
		//window.location.href='login';
		history.back();
	}
	else
	{
		var tag = '{"error": "';
		var start = request.responseText.indexOf(tag)+tag.length;
		var end = request.responseText.indexOf('"}');
		result.innerHTML = request.responseText.substring(start, end);
	}
}