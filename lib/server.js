//filename:	server.js
//author:	persist
//purpose:	enter module to listen requests

var http = require('http');
var url = require('url');
var fs = require('fs');

var data = require('./data');
var uuid = require('./uuid');
var hashmap = require('./hashmap');
var date = require('./date');

var client_index = fs.readFileSync('./view/client/index.html');
var client_index_js = fs.readFileSync('./view/client/index.js');
var client_detail = fs.readFileSync('./view/client/detail.html');
var client_detail_js = fs.readFileSync('./view/client/detail.js');
var client_person = fs.readFileSync('./view/client/person.html');
var client_person_js = fs.readFileSync('./view/client/person.js');
var client_car = fs.readFileSync('./view/client/car.html');
var client_car_js = fs.readFileSync('./view/client/car.js');
var client_login = fs.readFileSync('./view/client/login.html');
var client_login_js = fs.readFileSync('./view/client/login.js');
var client_register = fs.readFileSync('./view/client/register.html');
var client_register_js = fs.readFileSync('./view/client/register.js');
var client_modify = fs.readFileSync('./view/client/modify.html');
var client_modify_js = fs.readFileSync('./view/client/modify.js')

var admin_index = fs.readFileSync('./view/admin/index.html');
var admin_index_js = fs.readFileSync('./view/admin/index.js');
var admin_login = fs.readFileSync('./view/admin/login.html');
var admin_login_js = fs.readFileSync('./view/admin/login.js');


//global properties
var client_map = new hashmap.HashMap();
var admin_map = new hashmap.HashMap();

var common_header = {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'};

//start run

data.init('../mysql.json');

http.createServer(function(request, response)
{
	var body = [];

	console.log(request.headers);
	var cookies = {};
    request.headers.cookie && request.headers.cookie.split(';').forEach(function( Cookie ) {
        var parts = Cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    console.log(cookies);


	request.on('data', function(chunk)
	{
		body.push(chunk);
	});

	request.on('end', function(chunk)
	{
		//dispatch url and return
		var parse = url.parse(request.url, true);
		var pathname = parse.pathname;
		var query = parse.query;
		console.log('query:', query);
		console.log('origin pathname:', pathname);
		if(pathname[0] != '/')
		{
			pathname = '/'+pathname;
		}
		if(pathname[pathname.length-1] == '/')
			pathname = pathname.substr(0, pathname.length-1);
		dispatchRequest(pathname, request.method, query, cookies, body.join(''), response)
	});

})
.listen(8124);


function dispatchRequest(pathname, method, query, cookies, body, response)
{
	
	console.log('pathname:', pathname);
	console.log('method:', method);
	console.log('cookies:', cookies)
	console.log('body:', body);

	var role = cookies['role'];
	var user = cookies['user'];
	var user_uuid = cookies['uuid'];
	var auth = 'invalid';
	if(role)
	{
		switch(role)
		{
			case 'client':
				if(user && (user_uuid == client_map.get(user)))
				{
					auth = 'client';
				}
				break;
			case 'admin':
				if(user && (user_uuid == admin_map.get(user)))
				{
					auth = 'admin';
				}
				break;
		}
	}

	console.log('auth', auth);

	var params = null;
	if(method == 'GET')
	{
		params = query;
	}
	else if(body)
	{
		try
		{
			params = JSON.parse(body);
		}
		catch(err)
		{
			response.writeHead(400, common_header);
			response.end(err.message);
		}
	}
	
	switch(pathname)
	{
		//用户主页
		case '/client':
		case '/client/index':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_index);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client.js':
		case '/client/index.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_index_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/detail':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_detail);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/detail.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_detail_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/person':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_person);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/person.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_person_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/modify':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_modify);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/modify.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_modify_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;

		case '/client/car':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_car);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/car.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_car_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//用户登录
		case '/client/login':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_login);
					break;
				case 'POST':
					if(!params || !params.username || !params.password)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "Username or password is missing"}');
					}
					else
					{
						data.clientLogin(params.username, params.password, function(err, results, fields)
						{
							if(err)
							{
								response.writeHead(400, common_header);
								response.end('{"error": "'+err.message+'"}');
							}
							else if(!results || results.length <= 0)
							{
								response.writeHead(400, common_header);
								response.end('{"error": "Username or password is wrong"}');
							}
							else
							{
								var client_id = results[0]['_id'];
								var client_name = results[0]['name'];
								var client_uuid = uuid.generateUUID();
								client_map.put(client_id, client_uuid);
								var cookie = ['role=client', 'user='+client_id, 'uuid='+client_uuid, 'lasttime='+date.now()];
								console.log('put cookie', cookie);
								response.setHeader('Set-Cookie', cookie);
								response.writeHead(200, common_header);
								response.end('{"user": '+client_id+', "uuid": "'+client_uuid+'", "name": "'+client_name+'"}');
							}
						});
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/login.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_login_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//用户退出
		case '/client/logout':
			switch(method)
			{
				case 'PUT':
					if(auth == 'client')
					{
						client_map.remove(user);
						var cookie = [
						'role=invalid;expires='+new Date(0).toGMTString(), 
						'user=-1;expires='+new Date(0).toGMTString(),
						'uuid=invalid;expires='+new Date(0).toGMTString(),
						'lasttime=0;expires='+new Date(0).toGMTString(),
						'name=null;expires='+new Date(0).toGMTString()
						];
						response.setHeader('Set-Cookie', cookie);
						response.writeHead(200, common_header);
						response.end('{"status": "Succeed to logout"}');
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//用户注册
		case '/client/register':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_register);
					break;
				case 'POST':
					if(!params || !params.name || !params.mail || !params.phone || !params.password)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "name, mail, phone or password is missing"}');
					}
					else
					{
						data.clientRegister(params.name, params.mail, params.phone, params.password, params.avatar, params.sex, params.birthday, 
							function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else
								{
									response.writeHead(201, common_header);
									response.end('{"status": "Succeed to register '+params.name+'"}');
								}
							});
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/client/register.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(client_register_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//用户信息查询、修改
		case '/client/info':
			switch(method)
			{
				case 'GET':
					if(auth == 'client')
					{
						data.clientInfoGet(user, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									response.writeHead(404, common_header);
									response.end('{"error": "No such client"}');
								}
								else
								{
									response.writeHead(200, common_header);
									response.end(JSON.stringify(results[0]));
								}
							});
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					
					break;
				case 'PATCH':
					if(auth == 'client')
					{
						data.clientInfoPatch(user, params.name, params.phone, params.avatar, params.sex, params.birthday, params.addrs, params.old_password, params.password,
							function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else
								{
									response.writeHead(200, common_header);
									var items = [];
									for(var i in params)
									{
										items.push(i);
									}
									response.end('{"items":'+JSON.stringify(items)+'}');
								}
							});
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//用户订单增、删、查、改
		case '/client/orders':
			switch(method)
			{
				case 'GET':
					if(auth == 'client')
					{
						var from = 0;
						var count = 60;
						if(params && params.start)
							from = params.start;
						if(params && params.count)
							count = params.count;
						data.clientOrdersGet(user, from, count, params.status, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									response.writeHead(404, common_header);
									response.end('{"error": "No such orders"}');
								}
								else
								{
									response.writeHead(200, common_header);
									var final_results = {
										start : from,
										num : results.length,
										orders : results
									}
									response.end(JSON.stringify(final_results));
								}
							});
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				case 'PUT':
					if(auth == 'client')
					{
						if(!params || !params.create_time || !params.recv_name 
							|| !params.recv_phone || !params.recv_addr || !params.goods)
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Order information is not enough"}');
						}
						else
						{
							data.clientOrdersPut(user, params.create_time, params.recv_name, 
								params.recv_phone, params.recv_addr, params.goods, function(err, results, fields)
								{
									if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(201, common_header);
										response.end('{"id": "'+results.insertId+'"}');
									}
								});
						}
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				case 'PATCH':
					if(auth == 'client')
					{
						if(!params || !params.id)
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Id is missing"}');
						}
						else
						{
							data.clientOrdersPatch(params.id, function(err, results, fields)
								{
									if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(204, common_header);
										response.end();
									}
								});
						}
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				case 'DELETE':
					if(auth == 'client')
					{
						if(!params || !params.id)
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Id is missing"}');
						}
						else
						{
							data.clientOrdersDelete(params.id, function(err, results, fields)
								{
									if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(204, common_header);
										response.end();
									}
								});
						}
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//用户订单数量查询
		case '/client/orders/count':
			switch(method)
			{
				case 'GET':
					if(auth == 'client')
					{
						var status = null;
						if(params && params.status)
							status = params.status;
						data.clientOrdersCountGet(user, status, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									response.writeHead(404, common_header);
									response.end('{"error": "No such orders"}');
								}
								else
								{
									response.writeHead(200, common_header);
									response.end('{"count":"'+results[0][fields[0].name]+'"}');
								}
							});
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/admin':
		case '/admin/index':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(admin_index);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/admin.js':
		case '/admin/index.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(admin_index_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//管理员登录
		case '/admin/login':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(admin_login);
					break;
				case 'POST':
					if(!params || !params.username || !params.password)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "Username or password is missing"}');
					}
					else
					{
						data.adminLogin(params.username, params.password, function(err, results, fields)
						{
							if(err)
							{
								response.writeHead(400, common_header);
								response.end('{"error": "'+err.message+'"}');
							}
							else if(!results || results.length <= 0)
							{
								response.writeHead(400, common_header);
								response.end('{"error": "Username or password is wrong"}');
							}
							else
							{
								var admin_id = results[0]['_id'];
								var admin_uuid = uuid.generateUUID();
								admin_map.put(admin_id, admin_uuid);
								var cookie = ['role=admin', 'user='+admin_id, 'uuid='+admin_uuid, 'lasttime='+date.now()];
								response.setHeader('Set-Cookie', cookie);
								response.writeHead(200, common_header);
								response.end('{"user": '+admin_id+', "uuid":'+admin_uuid+'}');
							}
						});
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/admin/login.js':
			switch(method)
			{
				case 'GET':
					response.writeHead(200, {'Content-Type': 'text/html'});
					response.end(admin_login_js);
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//管理员退出
		case '/admin/logout':
			switch(method)
			{
				case 'PUT':
					if(auth == 'admin')
					{
						admin_map.remove(user);
						var cookie = [
						'role=invalid;expires='+new Date(0).toGMTString(), 
						'user=-1;expires='+new Date(0).toGMTString(),
						'uuid=invalid;expires='+new Date(0).toGMTString(),
						'lasttime=0;expires='+new Date(0).toGMTString(),
						];
						response.setHeader('Set-Cookie', cookie);
						response.writeHead(200, common_header);
						response.end('{"status": "Succeed to logout"}');
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//管理员注册
		case '/admin/register':
			switch(method)
			{
				case 'POST':
					if(!params || !params.usernamer || !params.password)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "Username or password is missing"}');
					}
					else
					{
						data.adminRegister(params.username, params.password, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else
								{
									response.writeHead(201, common_header);
									response.end('{"status": "Succeed to register '+params.username+'"}');
								}
							});
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//管理员信息修改
		case '/admin/info':
			switch(method)
			{
				case 'PATCH':
					if(auth == 'admin')
					{
						data.adminInfoPatch(params.old_password, params.password, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else
								{
									response.writeHead(200, common_header);
									var items = [];
									for(var i in params)
									{
										items.push(i);
									}
									response.end('{"items": ["password"]}');
								}
							});
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//管理员订单查询、修改
		case '/admin/orders':
			switch(method)
			{
				case 'GET':
					if(auth == 'admin')
					{
						var from = 0;
						var count = 60;
						var status = null;
						var client = null;
						if(params && params.start)
							from = params.start;
						if(params && params.count)
							count = params.count;
						if(params && params.status)
							status = params.status;
						if(params && params.client)
							client = params.client;
						data.adminOrdersGet(from, count, params.status, params.client, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									response.writeHead(404, common_header);
									response.end('{"error": "No such orders"}');
								}
								else
								{
									response.writeHead(200, common_header);
									var final_results = {
										start : from,
										num : results.length,
										orders : results
									}
									response.end(JSON.stringify(final_results));
								}
							});
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				case 'PUT':
					if(auth == 'admin')
					{
						if(!params || !params.create_time || !params.goods)
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Order information is not enough"}');
						}
						else
						{
							data.adminOrdersPut(user, params.create_time, params.goods, function(err, results, fields)
								{
									if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(201, common_header);
										response.end('{"id": "'+results.insertId+'"}');
									}
								});
						}
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				case 'PATCH':
					if(auth == 'admin')
					{
						if(!params || !params.id)
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Id is missing"}');
						}
						else
						{
							data.adminOrdersPatch(params.id, function(err, results, fields)
								{
									if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(204, common_header);
										response.end();
									}
								});
						}
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//管理员账单查询
		case '/admin/bills':
			switch(method)
			{
				case 'GET':
					if(auth == 'admin')
					{
						var from = 0;
						var count = 60;
						data.adminBillsGet(from, count, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									response.writeHead(404, common_header);
									response.end('{"error": "No such orders"}');
								}
								else
								{
									response.writeHead(200, common_header);
									var final_results = {
										start : from,
										num : results.length,
										bills : results
									}
									response.end(JSON.stringify(final_results));
								}
							});
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		case '/admin/goods':
		//商品信息增、删、查、改
		case '/goods':
			switch(method)
			{
				case 'GET':
					if(!params || !params.id)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "Goods Id is missing"}');
					}
					else
					{
						data.goodsGet(params.id, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else
								{
									response.writeHead(200, common_header);
									response.end(JSON.stringify(results[0]));
								}
							});
					}
					break;
				case 'PUT':
					if(auth == 'admin')
					{
						if(!params || !params.name || !params.type 
							|| !params.price || !params.description || !params.service
							 )
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Goods information is not enough"}');
						}
						else
						{
							data.goodsPut(params.name, params.type, params.price,  
								params.description, params.service, params.imgs, 
								params.props, function(err, results, fields)
								{
									if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(201, common_header);
										response.end('{"id":"'+results.insertId+'"}');
									}
								});
						}
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				case 'PATCH':
					if(auth == 'admin')
					{
						if(!params || !params.id)
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Goods Id is missing"}');
						}
						else
						{
							data.goodsPatch(params.id, params.name, params.type, params.price,  
								params.description, params.service, params.imgs, 
								params.props, function(err, results, fields)
								{
									if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(204, common_header);
										response.end();
									}
								});
						}
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
					break;
				case 'DELETE':
					if(auth == 'admin')
					{
						if(!params || !params.id)
						{
							response.writeHead(400, common_header);
							response.end('{"error": "Goods Id is missing"}');
						}
						else
						{
							data.goodsDelete(params.id, function(err, results, fields)
							{
								if(err)
									{
										response.writeHead(400, common_header);
										response.end('{"error": "'+err.message+'"}');
									}
									else
									{
										response.writeHead(204, common_header);
										response.end();
									}
							});
						}
						
					}
					else
					{
						response.writeHead(403, common_header);
						response.end('{"error": "No authorization"}');
					}
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//商品数量查询
		case '/goods/count':
			switch(method)
			{
				case 'GET':
					if(!params || !params.id)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "Goods Id is missing"}');
					}
					else
					{
						data.goodsCountGet(params.id, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									response.writeHead(404, common_header);
									response.end('{"error": "No such goods"}');
								}
								else
								{
									response.writeHead(200, common_header);
									response.end('{"count":"'+results[0][fields[0].name]+'"}');
								}
							});
					}
					
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//商品种类查询
		case '/goods/type':
			switch(method)
			{
				case 'GET':
					if(!params)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "Goods type information is missing"}');
					}
					else
					{
						var from = 0;
						var count = 60;
						if(params && params.start)
							from = params.start;
						if(params && params.count)
							count = params.count;
						if(!params.type)
							console.log('type is null');
						data.goodsTypeGet(params.type, from, count, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									console.log('results:', results);
									response.writeHead(404, common_header);
									response.end('{"error": "No such goods"}');
								}
								else
								{
									response.writeHead(200, common_header);
									var final_results = 
									{
										start 	: from, 
										num 	: results.length,
										goods 	: results
									}
									response.end(JSON.stringify(final_results));
								}
							});
					}
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		//商品种类数目查询
		case '/goods/type/count':
			switch(method)
			{
				case 'GET':
					if(!params || !params.type)
					{
						response.writeHead(400, common_header);
						response.end('{"error": "Goods type is missing"}');
					}
					else
					{
						data.goodsTypeCountGet(params.type, function(err, results, fields)
							{
								if(err)
								{
									response.writeHead(400, common_header);
									response.end('{"error": "'+err.message+'"}');
								}
								else if(!results || results.length <= 0)
								{
									response.writeHead(404, common_header);
									response.end('{"error": "No such goods"}');
								}
								else
								{
									response.writeHead(200, common_header);
									response.end('{"count":"'+results[0][fields[0].name]+'"}');
								}
							});
					}
					
					break;
				default:
					response.writeHead(403, common_header);
					response.end('{"error": "No such method"}');
			}
			break;
		default:
			response.writeHead(403, common_header);
			response.end('{"error": "Unknown pathname '+pathname+'"}');
	}
}