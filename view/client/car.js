
var TYPE = '/goods/type';
var DETAIL = '/client/detail';
var PERSON = '/client/person';
var ORDER = '/client/orders';


var role;
var user;
var uuid;
var name;
var lasttime;
var online = false;

var goods_list = [];

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


function load(class_name)
{
	checkOnline();
	if(!online)
		return;
	var content = getCookie('goods');
	console.log('goods', content);

	var list = content.split(',');
	console.log('list', list);
	if(list.length < 3)
		return;
	for(var i = 0; i < list.length; i += 3)
	{
		var obj = 
		{
			goods_id : parseInt(list[i]),
			goods_count : parseInt(list[i+1]),
			goods_money : parseInt(list[i+2])
		};
		goods_list.push(obj);
		console.log('push item: ', obj);
	}

	var goods = document.getElementById('goods');

	var single;
    var div;
    var del;
    for(var index in goods_list)
    {
        single = goods_list[index];
        console.log('single item', single);
        div = document.createElement('div');
        id = document.createElement('p');
        id.innerHTML = '商品标识：'+single['goods_id'];
        count = document.createElement('h3');
        count.innerHTML = '商品数量：'+single['goods_count'];
        money = document.createElement('h3');
        money.innerHTML = '商品总价：'+single['goods_money'];
        del = document.createElement('button');
        del.innerHTML = '删除此商品';
        div.appendChild(id);
        div.appendChild(count);
        div.appendChild(money);
        div.appendChild(del);
        div.className = class_name;
        div.id = "goods-"+single['goods_id'];
        del.onclick = function(){deleteGoods(this.parentNode.id);};
        goods.appendChild(div);
       }
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

function toMysqlFormat(date)
{
	return date.getUTCFullYear() + "-" 
	+ twoDigits(1 + date.getUTCMonth()) + "-" 
	+ twoDigits(date.getUTCDate()) + " " 
	+ twoDigits(date.getUTCHours()) + ":" 
	+ twoDigits(date.getUTCMinutes()) + ":" 
	+ twoDigits(date.getUTCSeconds());
}

function now()
{
	return toMysqlFormat(new Date());
}


function pay()
{

	var form = document.getElementById('form');
	var error = document.getElementById('error');

	var name = form.elements['name'].value;
	var phone = form.elements['phone'].value;
	var addr = form.elements['addr'].value;

	if(!name || name.length > 50)
	{
		error.innerHTML = 'Name is empty or too large';
		return;
	}

	if(!phone || phone.length != 11)
	{
		error.innerHTML = 'Phone is empty or illegal';
		return;
	}

	if(!addr || addr.length > 50)
	{
		error.innerHTML = 'Address is empty or too large';
		return;
	}

	if(goods_list.length <= 0)
	{
		error.innerHTML = 'Goods list is empty,please select goods first';
		return;
	}

	error.innerHTML = '';
	var post = 
	{
		create_time : now(),
		recv_name : name,
		recv_phone : phone,
		recv_phone : phone,
		recv_addr : addr,
		goods : goods_list
	}
	console.log(post);

	var request = new XMLHttpRequest();
	request.open('PUT', window.location.origin+ORDER, false);
	request.send(JSON.stringify(post));
	var result = document.getElementById('error');
	if(request.status == 201)
	{
		result.innerHTML = 'Pay Succeed!';
		console.log(window.location.href);
		alert('Pay Succeed!');
		delCookie('goods');
		goods_list = null;
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

function deleteGoods(id)
{
	var _id = id.split('-')[1];
	var idNum = parseInt(_id);
	console.log('delete', _id);

	var single;
	for(var index in goods_list)
	{
		single = goods_list[index];
		if(single['goods_id'] == idNum)
		{
			goods_list.splice(index, 1);

			var content = getCookie('goods');
			var list = content.split(',');
			console.log('list', list);
			for(var i = 0; i < list.length; i += 3)
			{
				if(list[i] == _id)
				{
					list.splice(i, 3);
					break;
				}
				else
				{
					console.log('compare: ', list[i], _id);
				}
			}
			setCookie('goods', list.join(','));
			console.log('goods', list.join(','));

			break;
		}
		else
		{
			console.log('compare: ', single['goods_id'], _id);
		}
	}
	

	var goods = document.getElementById('goods');
	var item = document.getElementById(id);
	console.log('parent', goods);
	console.log('child', item);
	goods.removeChild(item);
}
