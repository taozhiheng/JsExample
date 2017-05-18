var LOGIN = '/admin/login';

function login()
{
	var form = document.getElementById('form');
	var username = form.elements['username'].value;
	var password = form.elements['password'].value;

	var request = new XMLHttpRequest();
	request.open('POST', window.location.origin+LOGIN, false);
	var post = 
	{
		username : username,
		password : password
	};
	request.send(JSON.stringify(post));
	var result = document.getElementById('result');
	if(request.status == 200)
	{
		// document.cookie = '';
		console.log('cookie', document.cookie);
		result.innerHTML = 'Login Succeed! Welcome!';
		alert('Login Succeed!');
		history.back();
		//window.location.pathname='/client';
	}
	else
	{
		var tag = '{"error": "';
		var start = request.responseText.indexOf(tag)+tag.length;
		var end = request.responseText.indexOf('"}');
		result.innerHTML = request.responseText.substring(start, end);
	}
}
