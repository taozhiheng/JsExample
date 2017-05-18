
var TYPE = '/goods/type';
var DETAIL = '/client/detail';
var PERSON = '/client/person';
var CAR = '/client/car';

var current_type;
var current_start = 0;
var current_count = 60;

var role;
var user;
var uuid;
var name;
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
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 

function checkOnline()
{
	//check cookie
	role = getCookie('role');
	user = getCookie('user');
	uuid = getCookie('uuid');
	name = getCookie('name');
	lasttime = getCookie('lasttime');
	//set online status
	if(role && (role == 'client') && user && uuid && lasttime)
	{
		online = true;
	}
	console.log('role', role);
	console.log('user', user);
	console.log('uuid', uuid);
	console.log('name', name);
	console.log('lasttime', lasttime);
	console.log('online', online);
	var user_board = document.getElementById('user_enter');
	if(online)
	{
		user_board.innerHTML = 'Welcome '+name;
		return;
	}
	else
	{
		user_board.innerHTML = '请登录';
	}
}

function viewCar()
{
	if(online)
	{
		window.open(CAR);
	}
	else
	{
		alert('你可能未登录');
        //window.location.pathname='/client/login';
	}
}

function login() 
{
	if(online)
	{
		//alert('Welcome');
		window.open(PERSON+"?id="+user);
	}
	else
	{
		console.log('login');
		window.location.pathname='/client/login';
	}
}

function setClass(element, class_name)
{
	//console.log('setClassName', class_name);
	//element.className = class_name;
}

function viewGoods(element, class_name)
{
	console.log('viewGoods');
	console.log(element.innerHTML);
	var request = new XMLHttpRequest();
	var query = '?type='+element.name
	+"&start="+(current_start)
	+'&count='+current_count;
	request.open('GET', window.location.origin+TYPE+query, false);
	request.send();
	
	var goods = document.getElementById('goods');
	if(request.status == 200)
	{
		var curClassify = document.getElementById('curClassify');
		curClassify.innerHTML = element.innerHTML;
		var result = JSON.parse(request.responseText);
		//remove all children
		while (goods.firstChild) 
		{
			goods.removeChild(goods.firstChild);
		}

		var single;
		//current_start = result.start+result.num;
		console.log('start', result.start);
		console.log('num', result.num);
		var div;
		var name;
		var description;
		var service;
		var price;
		for(var index in result.goods)
		{
			single = result.goods[index];
			console.log('single item', single);
			div = document.createElement('div');
			name = document.createElement('h3');
			name.innerHTML = single.name;
			description = document.createElement('p');
			description.innerHTML = single.description;
			service = document.createElement('p');
			service.innerHTML = single.service;
			price = document.createElement('p');
			price.innerHTML = 'RMB: '+single.price;
			div.appendChild(name);
			div.appendChild(description);
			div.appendChild(service);
			div.appendChild(price);
			div.className = class_name;
			div.id = "item-"+single['_id'];
			div.onclick = function(){viewDetail(this.id);};
			goods.appendChild(div);
		}
	}
}

/**
redirect to goods detail page
*/
function viewDetail(id)
{
	var _id = id.split('-')[1];
	console.log('open', DETAIL+'?id='+_id);
	window.open(DETAIL+'?id='+_id);
}
