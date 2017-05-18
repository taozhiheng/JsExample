var GOODS = '/admin/goods';
var LOGOUT = '/admin/logout';

var role;
var user;
var uuid;
var lasttime;
var online = false;

console.log(window.location);

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
    var exp = new Date(0); 
    //exp.setTime(exp.getTime() - 100); 
    var cval=getCookie(name); 
    if(cval!=null) 
    {
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
        console.log('del cookie ', name);
    }
} 

function checkOnline()
{
	//check cookie
	role = getCookie('role');
	user = getCookie('user');
	uuid = getCookie('uuid');
	lasttime = getCookie('lasttime');
	//set online status
	if(role && (role == 'admin') && user && uuid && lasttime)
	{
		online = true;
	}
	console.log('role', role);
	console.log('user', user);
	console.log('uuid', uuid);
	console.log('lasttime', lasttime);
	console.log('online', online);
	var user_board = document.getElementById('user_enter');
	if(online)
	{
		user_board.innerHTML = 'Welcome';
		return;
	}
	else
	{
		user_board.innerHTML = '请登录';
	}
}

function login() 
{
	if(online)
	{
        var request = new XMLHttpRequest();
        request.open('PUT', window.location.origin+LOGOUT, false);
        request.send();
        if(request.status == 200)
        {
            role = null;
        	user = null;
        	uuid = null;
        	lasttime = null;
        	online = false;
        	var user_board = document.getElementById('user_enter');
        	user_board.innerHTML = '请登录';
            alert('You have Logout!');
        }
        else if(request.status == 403)
    	{
        	alert('请先登录');
        	window.location.pathname='/admin/login';
        	return;
    	}
        else
        {
            console.log('error', request.responseText);
        }
	}
	else
	{
		console.log('login');
		window.location.pathname='/admin/login';
	}
}

function add()
{
	var form = document.getElementById('form');
	var error = document.getElementById('error');
	var name = form.elements['name'].value;
	var type = form.elements['type'].value;
	var price = form.elements['price'].value;
	var description = form.elements['description'].value;
	var service = form.elements['service'].value;

	if(!name || name.length > 50)
	{
		error.innerHTML = 'Name is empty or too large';
		return;
	}

	if(!type)
	{
		error.innerHTML = 'Type is empty or illegal';
		return;
	}

	if(!price || price <= 0)
	{
		error.innerHTML = 'Price is illegal';
		return;
	}

	if(!description)
	{
		error.innerHTML = 'Description is empty';
		return;
	}

	if(!service)
	{
		error.innerHTML = 'Service is empty';
		return;
	}

	error.innerHTML = '';

	var post = 
	{
		name : name,
		type : type,
		price : price,
		description : description,
		service : service
	}
	console.log(post);

	var request = new XMLHttpRequest();
	request.open('PUT', window.location.origin+GOODS, false);
	request.send(JSON.stringify(post));
	var result = document.getElementById('result');
	if(request.status == 201)
	{
		result.innerHTML = 'Add goods '+name+' Succeed!';
		console.log(window.location.href);
		alert('Add goods '+name+' Succeed!');
		//window.location.href='login';
	}
	else if(request.status == 403)
    {
        alert('请先登录');
        window.location.pathname='/admin/login';
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

function modify()
{
	console.log('modify');
	var form = document.getElementById('form');
	var error = document.getElementById('error');
	var id = form.elements['id'].value;
	var name = form.elements['name'].value;
	var type = form.elements['type'].value;
	var price = form.elements['price'].value;
	var description = form.elements['description'].value;
	var service = form.elements['service'].value;

	if(!id || id < 0)
	{
		error.innerHTML = 'Id is empty or illegal';
		return;
	}

	if(name && name.length > 50)
	{
		error.innerHTML = 'Name is too large';
		return;
	}

	if(price && price <= 0)
	{
		error.innerHTML = 'Price is illegal';
		return;
	}


	error.innerHTML = '';

	var patch = 
	{
		id : id,
		name : name,
		type : type,
		price : price,
		description : description,
		service : service
	}
	console.log(patch);

	var request = new XMLHttpRequest();
	request.open('PATCH', window.location.origin+GOODS, false);
	request.send(JSON.stringify(patch));
	var result = document.getElementById('result');
	if(request.status == 204)
	{
		result.innerHTML = 'Modify goods '+name+' Succeed!';
		console.log(window.location.href);
		alert('Modify goods '+name+' Succeed!');
		//window.location.href='login';
	}
	else if(request.status == 403)
    {
        alert('请先登录');
        window.location.pathname='/admin/login';
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