var LOGIN = '/client/login';
var REGISTER = '/client/register';


//写cookies 
function setCookie(name,value, hours) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + hours*60*60*1000); 
    document.cookie = name + "="+ escape (value) + ";expires=-1"; 
} 

//读取cookies 
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 

//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 

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
		console.log('cookie', document.cookie);
		var info = JSON.parse(request.responseText);
		if(info.name)
		{
			setCookie('name', info.name);
		}
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

function register()
{
	console.log('register');
	window.location.pathname='/client/register';
}