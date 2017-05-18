var INFO = '/client/info';
var myreg =  /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

function modify()
{
	var form = document.getElementById('form');
	var error = document.getElementById('error');
	var name = form.elements['name'].value;
	var phone = form.elements['phone'].value;
	var password = form.elements['password'].value;
	var password2 = form.elements['password2'].value;
	var avatar = form.elements['avatar'].value;
	var sex = form.elements['sex']['1'].checked;
	var birthday = form.elements['birthday'].value;

	if(name && name.length > 50)
	{
		error.innerHTML = 'Name is empty or too large';
		return;
	}


	if(phone && phone.length != 11)
	{
		error.innerHTML = 'Phone is illegal';
		return;
	}

	if(password && (password.length < 6 || password.length > 16))
	{
		error.innerHTML = 'Old password is too short or too long';
		return;
	}

	if(password2 && (password2.length < 6 || password2.length > 16))
	{
		error.innerHTML = 'New password istoo short or too long';
		return;
	}

	error.innerHTML = '';

	var patch = 
	{
		name : name,
		phone : phone,
		old_password : password,
		password : password2,
		avatar : avatar,
		sex : sex,
		birthday : birthday
	}
	console.log(patch);

	var request = new XMLHttpRequest();
	request.open('PATCH', window.location.origin+INFO, false);
	request.send(JSON.stringify(patch));
	var result = document.getElementById('result');
	if(request.status == 200)
	{
		result.innerHTML = 'Modify Personal Information Succeed!';
		console.log(window.location.href);
		alert('Modify Succeed!');
		//window.location.href='login';
		history.back();
	}
	else if(request.status == 403)
	{
		alert('请先登录');
        window.location.pathname='/client/login';
        return;
	}
	else
	{
		var tag = '{"error": "';
		var start = request.responseText.indexOf(tag)+tag.length;
		var end = request.responseText.indexOf('"}');
		result.innerHTML = request.responseText.substring(start, end);
	}
}