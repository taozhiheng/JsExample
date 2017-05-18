var INFO = '/client/info';
var ORDER = '/client/orders';
var CAR = '/client/car';
var LOGOUT = '/client/logout';
var MODIFY = "/client/modify";

var role;
var user;
var uuid;
var name;
var lasttime;
var online = false;

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
        var request = new XMLHttpRequest();
        request.open('PUT', window.location.origin+LOGOUT, false);
        request.send();
        if(request.status == 200)
        {
            role = null;
            user = null;
            uuid = null;
            name = null;
            lasttime = null;
            online = false;
            var user_board = document.getElementById('user_enter');
            user_board.innerHTML = '请登录';
            alert('You have Logout!');
        }
        else
        {
            console.log('error', request.responseText);
        }
    }
    else
    {
        console.log('login');
        window.location.pathname='/client/login';
    }
}

function load(title_class, item_class)
{
    //check online
    checkOnline();
    console.log('load', window.location);
    var request = new XMLHttpRequest();
    request.open('GET', window.location.origin+INFO+window.location.search, false);
    request.send();
    if(request.status == 200)
    {
        console.log(request.responseText);
        var info = JSON.parse(request.responseText);
        var user_name = document.getElementById('name')
        user_name.innerHTML = info.name;
        var avatar = document.getElementById('avatar');
        avatar.innerHTML = info.avatar;
        var sex = document.getElementById('sex');
        if(info.sex == 0 || info.sex == false)
            sex.innerHTML = '男';
        else
            sex.innerHTML = '女';
        var birthday = document.getElementById('birthday');
        birthday.innerHTML = info.birthday;
        var mail = document.getElementById('mail');
        mail.innerHTML = info.mail;
        var phone = document.getElementById('phone');
        phone.innerHTML = info.phone;
    }
    else if(request.status == 403)
    {
        alert('请先登录');
        window.location.pathname='/client/login';
        return;
    }
    else
    {
        console.log('error', request.responseText);
    }

    request.open('GET', window.location.origin+ORDER, false);
    request.send();
    if(request.status == 200)
    {
        console.log(request.responseText);
        var orders = document.getElementById('orders');
        var result = JSON.parse(request.responseText);
        //remove all children
        while (orders.firstChild) 
        {
            orders.removeChild(orders.firstChild);
        }

        var single;
        //current_start = result.start+result.num;
        console.log('start', result.start);
        console.log('num', result.num);
        var createTime;
        var recvName;
        var recvPhone;
        var recvAddr;
        for(var index in result.orders)
        {
            single = result.orders[index];
            console.log('single item', single);

            createTime = document.createElement('h3');
            createTime.innerHTML = single['create_time'];
            createTime.className = title_class;
            recvName = document.createElement('h3');
            recvName.innerHTML = single['recv_name'];
            recvName.className = title_class;
            recvPhone = document.createElement('h3');
            recvPhone.innerHTML = single['recv_phone'];
            recvPhone.className = title_class;
            recvAddr = document.createElement('h3');
            recvAddr.innerHTML = single['recv_addr'];    
            recvAddr.className = title_class;

            orders.appendChild(createTime);
            orders.appendChild(recvName);
            orders.appendChild(recvPhone);
            orders.appendChild(recvAddr);

            var goods = single['goods'];
            var item;
            var div;
            var goodsId;
            var goodsCount;
            var goodsMoney;
            for(var i in goods)
            {
                item = goods[i];
                div = document.createElement('div');
                goodsId = document.createElement('p');
                goodsId.innerHTML = '商品标识：'+item['goods_id'];
                goodsCount = document.createElement('p');
                goodsCount.innerHTML = '商品数量：'+item['goods_count'];
                goodsMoney = document.createElement('h3');
                goodsMoney.innerHTML = '商品总价：'+item['goods_money'];
                div.appendChild(goodsId);
                div.appendChild(goodsCount);
                div.appendChild(goodsMoney);
                div.className = item_class;
                orders.appendChild(div);
            }
        }
    }
    else if(request.status == 403)
    {
        alert('请先登录');
        window.location.pathname='/client/login';
        return;
    }
    else
    {
        console.log('error', request.responseText);
    }
}

function modify()
{
    console.log('modify');
    if(online)
    {
        window.open(MODIFY);
    }
    else
    {
        console.log('login');
        window.location.pathname='/client/login';
    }
}
