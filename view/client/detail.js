var GOODS = '/goods';
var PERSON = '/client/person';
var CAR = '/client/car';

var role;
var user;
var uuid;
var name;
var lasttime;
var online = false;

var goods;

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
    console.log(user_board);
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

function load()
{
    console.log('load', window.location);
    var request = new XMLHttpRequest();
    request.open('GET', window.location.origin+GOODS+window.location.search, false);
    request.send();
    if(request.status == 200)
    {
        console.log(request.responseText);
        goods = JSON.parse(request.responseText);
        var name = document.getElementById('name').childNodes[1];
        console.log(name);
        name.innerHTML = goods.name;
        var description = document.getElementById('description').childNodes[1];
        console.log('description', description);
        description.innerHTML = goods.description;
        var service = document.getElementById('service').childNodes[1];
        console.log('service', service);
        service.innerHTML = goods.service;
        var price = document.getElementById('price').childNodes[1];
        console.log('price', price);
        price.innerHTML = 'RMB: '+goods.price;
    }
    else
    {
        console.log('error', request.responseText);
    }
    //check online
    checkOnline();

}

function buy()
{
    if(!online)
    {
        alert('你可能登录');
        //window.location.pathname='/client/login';
        //return;
    }
    var form = document.getElementById('form').childNodes[1];
    var num = form.elements['count'].value;
    if(num)
    {
        console.log(goods);
        var id = goods['_id'];
        var money = num*goods.price;
        console.log(id, num, money);
        var origin = getCookie('goods');
        var select = [];
        select.push(id);
        select.push(num);
        select.push(money);
        var cur = select.join(',');
        var item_num;
        var item_money;
        if(origin != null && origin.length > 0)
        {
            var list = origin.split(',');
            console.log('list', list);
            var i;
            for(i = 0; i < list.length; i += 3)
            {
                if(list[i] == id)
                {
                    item_num = parseInt(list[i+1])+num*1;
                    item_money = parseInt(list[i+2])+money;
                    console.log('num', item_num);
                    console.log('money', item_money);
                    list[i+1] = item_num;
                    list[i+2] = item_money;
                    setCookie('goods', list.join(','));
                    console.log('goods', list.join(','));
                    break;
                }
            }
            if(i >= list.length)
            {
                setCookie('goods', origin+','+cur);
                console.log('goods', origin+','+cur)
            }
        }
        else
        {
            setCookie('goods', cur);
            console.log('goods', cur)
        }
        alert('商品已加入购物车');
    }
}