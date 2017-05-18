//filename:	data.js
//author:	persist
//purpose:	used as a module to operate specific tables in database	

var db = require('./db');
var RowDataPacket = require('mysql/lib/protocol/packets/RowDataPacket');
var FieldPacket = require('mysql/lib/protocol/packets/FieldPacket');
var date = require('./date');
//constant values
//table name:
var CLIENTS = 'clients';
var ADMINS = 'admins';
var GOODS = 'goods';
var ORDERS = 'orders';
var BILLS = 'bills';
var REPO = 'repo';
//sql:
var CREATE_CLIENTS = 'CREATE TABLE IF NOT EXISTS clients ( \
_id INT AUTO_INCREMENT PRIMARY KEY, \
name VARCHAR(50) NOT NULL, \
avatar VARCHAR(80), \
sex BOOLEAN DEFAULT false, \
birthday DATE, \
mail VARCHAR(50) NOT NULL UNIQUE, \
phone CHAR(11), \
password VARCHAR(16) NOT NULL, \
addrs TEXT\
) ENGINE=InnoDB DEFAULT CHARSET=utf8';
var CREATE_ADMINS = 'CREATE TABLE IF NOT EXISTS admins ( \
_id INT AUTO_INCREMENT PRIMARY KEY, \
name VARCHAR(50) NOT NULL UNIQUE, \
password VARCHAR(16) NOT NULL \
) ENGINE=InnoDB DEFAULT CHARSET=utf8';
var CREATE_GOODS = 'CREATE TABLE IF NOT EXISTS goods ( \
_id INT AUTO_INCREMENT PRIMARY KEY, \
name VARCHAR(50) NOT NULL, \
type VARCHAR(50) NOT NULL, \
price FLOAT NOT NULL, \
description VARCHAR(512) NOT NULL, \
service VARCHAR(100), \
imgs VARCHAR(500),\
props TEXT\
) ENGINE=InnoDB DEFAULT CHARSET=utf8';
var CREATE_ORDERS = 'CREATE TABLE IF NOT EXISTS orders ( \
_id INT AUTO_INCREMENT PRIMARY KEY, \
client_id INT NOT NULL, \
create_time DATETIME NOT NULL, \
modify_time DATETIME NOT NULL, \
status INT DEFAULT 0, \
recv_name VARCHAR(50) NOT NULL, \
recv_phone CHAR(11) NOT NULL, \
recv_addr VARCHAR(200) NOT NULL, \
FOREIGN KEY (client_id) REFERENCES clients(_id) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8';
var CREATE_BILLS = 'CREATE TABLE IF NOT EXISTS bills ( \
order_id INT NOT NULL, \
goods_id INT NOT NULL, \
goods_count INT NOT NULL, \
goods_money FLOAT NOT NULL, \
time DATETIME NOT NULL, \
PRIMARY KEY (order_id, goods_id), \
FOREIGN KEY (order_id) REFERENCES orders(_id), \
FOREIGN KEY (goods_id) REFERENCES goods(_id) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8';
var CREATE_REPO = 'CREATE TABLE IF NOT EXISTS repo ( \
goods_id INT NOT NULL, \
goods_count INT NOT NULL, \
goods_total INT NOT NULL, \
PRIMARY KEY (goods_id), \
FOREIGN KEY (goods_id) REFERENCES goods(_id) \
) ENGINE=InnoDB DEFAULT CHARSET=utf8';

/**
读取配置文件建立数据库连接，检查或创建相关表
*/
function init(config_file)
{
	db.init(config_file, checkTables);
	var d = date.now();
	console.log(d);
}

/**
检查或创建相关表
*/
function checkTables()
{
	db.create(CREATE_CLIENTS, null);
	db.create(CREATE_ADMINS, null);
	db.create(CREATE_GOODS, null);
	db.create(CREATE_ORDERS, null);
	db.create(CREATE_BILLS, null);
	db.create(CREATE_REPO, null);
}

/**
关闭数据库连接
*/
function close()
{
	db.close();
}

/**
用户登录
查询用户密码
*/
function clientLogin(mail, password, callback)
{
	mail = db.escape(mail);
	password = db.escape(password);
	db.query(CLIENTS, ['_id', 'name'], 'mail='+mail+' AND password='+password, null, null, null, callback);
}

/**
用户注册
插入新用户，mail有unique约束
*/
function clientRegister(name, mail, phone, password, avatar, sex, birthday, callback)
{
	if(name == 'admin')
	{
		var err = new Error('ER_ILLEGAL_USERNAME_ERROR: The username is illegal');
		callback(err, null, null);
		return;
	}
	var columns = ['name', 'mail', 'phone', 'password'];
	var values = ['\''+name+'\'', '\''+mail+'\'', '\''+phone+'\'', '\''+password+'\''];
	if(avatar && avatar != null)
	{
		columns.push('avatar');
		values.push('\''+avatar+'\'');
	}
	if(sex && sex != null)
	{
		columns.push('sex');
		values.push('\''+sex+'\'');
	}
	if(birthday && birthday != null)
	{
		columns.push('birthday');
		values.push('\''+birthday+'\'');
	}
	db.insert(CLIENTS, columns, values, callback);
}

/**
查询用户信息
*/
function clientInfoGet(id, callback)
{
	id = db.escape(id);
	db.query(CLIENTS, null, '_id='+id, null, null, null, callback);
}

/**
修改用户信息
先查询用户密码，若用户不存在，返回err；
若需要修改密码，但旧密码不正确，返回err；
否则，更新用户信息
*/
function clientInfoPatch(id, name, phone, avatar, sex, birthday, addrs, old_password, password, callback)
{
	client_id = db.escape(id);
	call = callback;
	db.query(CLIENTS, ['password'], '_id='+client_id, null, null, null, function(err, results, fields)
	{
		if(err)
		{
			//exception
			call(err, results, fields);
		}
		else if(!results || results.length <= 0)
		{
			//client not exists
			err = new Error('ER_NO_SUCH_CLIENT_ERROR: No such client');
			call(err, null, null);
		}
		else if(password && results[0].password != old_password)
		{
			//old_password is wrong
			err = new Error('ER_NO_PERMISSION_ERROR: Old password is wrong');
			call(err, null, null);
		}
		else
		{
			var columns = [];
			var values = [];
			if(name && name != null)
			{
				columns.push('name');
				values.push('\''+name+'\'');
			}
			if(phone && phone != null)
			{
				columns.push('phone');
				values.push('\''+phone+'\'');
			}
			if(avatar && avatar != null)
			{
				columns.push('avatar');
				values.push('\''+avatar+'\'');
			}
			if(sex && sex != null)
			{
				columns.push('sex');
				values.push(sex);
			}
			if(birthday && birthday != null)
			{
				columns.push('birthday');
				values.push('\''+birthday+'\'');
			}
			if(addrs && addrs != null)
			{
				columns.push('addrs');
				values.push('\''+addrs+'\'');
			}
			if(password && password != null)
			{
				columns.push('password')
				values.push('\''+password+'\'');
			}
			if(columns.length == 0)
			{
				//no data to update
				err = new Error('ER_NO_DATA_ERROR: No data needs to be update');
				call(err, results, fields);
			}
			else
			{
				//update
				db.update(CLIENTS, columns, values, '_id='+client_id, call);
			}
		}
	});
}

/**
查询订单
*/
function queryOrder(columns, where, group, order, limit, callback)
{
	db.query(ORDERS, columns, where, group, order, limit, function(err, results, fields)
		{
			if(err || (!results || results.length <= 0))
			{
				console.log('query order error', err);
				callback(err, results, fields);
			}
			else
			{
				//travel each goods
				task = 0;
				orders = results;
				for(var i = 0; i < orders.length; i++)
				{
					db.query(BILLS, ['order_id', 'goods_id', 'goods_count', 'goods_money'], 'order_id='+orders[i]['_id'], null, null, null, 
						function(err, rows, fields)
						{
							console.log('query order detail error',err);
							//calculate task number
							task++;
							if(!err && rows && rows.length > 0)
							{
								console.log('orders', orders);
								console.log('rows', rows);


								for(var index = 0; index < orders.length; index++)
								{
									console.log('compare', orders[index]['_id'], rows[0]['order_id']);
									if(orders[index]['_id'] == rows[0]['order_id'])
									{
										orders[index].goods = rows;
										console.log('add goods');
										break;
									}
								}
								console.log('orders', orders, 'task', task);
							}
							//all tasks finish
							if(task == orders.length)
							{
								callback(err, orders, null);
							}
						})
				}
			}
		});
}

/**
查询用户订单
*/
function clientOrdersGet(client_id, start, count, status, callback)
{
	client_id = db.escape(client_id);
	status = db.escape(status);
	var where = 'client_id='+client_id;
	if(status && status != null)
	{
		where += 'AND status='+status;
	}
	queryOrder(null, where, null, null, [start, count], callback);
}

/**
插入用户订单
先插入订单概要，再插入商品清单
*/
function clientOrdersPut(client_id, create_time, recv_name, recv_phone, recv_addr, goods, callback)
{
	var columns = ['client_id', 'create_time', 'modify_time', 'recv_name', 'recv_phone', 'recv_addr'];
	//get current datetime
	var modify_time = date.now();
	var values = [client_id, '\''+create_time+'\'', '\''+modify_time+'\'', '\''+recv_name+'\'', '\''+recv_phone+'\'', '\''+recv_addr+'\''];
	// var goods = null;
	// try
	// {
	// 	console.log('goods_json', goods_json);
	// 	goods = JSON.parse(goods_json);
	// }
	// catch(err)
	// {
	// 	console.log('json error', err);
	// 	callback(err, null, null);
	// 	return;
	// }
	if(!goods || goods.length <= 0)
	{
		var err = new Error('ER_INVALID_GOODS_LIST_ERROR: The goods list is invalid');
		callback(err, null, null);
		return;
	}
	db.insert(ORDERS, columns, values, function(err, results, fields)
	{
		if(err)
		{
			//insert fail
			console('insert order base information error', err);
			callback(err, results, fields);
		}
		else
		{
			console.log('insert order base information ok, try to insert order detail');
			//travel goods and insert them into table bills
			var columns = ['order_id', 'goods_id', 'goods_count', 'goods_money', 'time'];
			var values = [results.insertId, 0, 0, 0, '\''+date.now()+'\''];
			var i;
			var j;
			var noErr = true;
			var eachCall = function(err, results, fields)
			{
				if(err)
				{
					noErr = false;
					db.delete(BILLS, 'goods_id='+values[0], null);
					db.delete(ORDERS, '_id='+values[0], null);
				}
			}
			for(i = 0; noErr && i < goods.length; i++)
			{
				for(j = 1; j < 4; j++)
				{
					values[j] = goods[i][columns[j]];
				}
				db.insert(BILLS, columns, values, eachCall);
			}
			if(noErr)
			{
				callback(err, results, fields);
			}
			else
			{
				err = new Error('ER_INSERT_BILL_FAIL_ERROR: Can not insert all goods to bills');
				callback(err, results, fields);
			}
		}
	});

}

/**
修改用户订单状态
0->1 待付款->待发货，
2->3 待收货->待评价，
3->4 待评价->已完成
*/
function clientOrdersPatch(id, callback)
{
	id = db.escape(id);
	//query order status
	db.query(ORDERS, ['status'], '_id='+id, null, null, null, function(err, results, fields)
	{
		if(err)
		{
			//exception
			callback(err, results, fields);
		}
		else if(!results || results.length <= 0)
		{
			//the order not exists
			err = new Error('ER_NO_SUCH_ORDER_ERROR: No such order');
			callback(err, null, null);
		}
		else
		{
			//check status
			var status = results[0].status;
			if(status == 1)
			{
				err = new Error('ER_NO_PERMISSION_ERROR: Can not change the status of the order');
				callback(err, null, null);
			}
			else
			{
				status += 1;
				db.update(ORDERS, ['status'], [status], '_id='+id, callback);
			}
		}
	});
}

/**
删除用户订单，只能删除待付款订单
*/
function clientOrdersDelete(id, callback)
{
	id = db.escape(id);
	//query order status
	db.query(ORDERS, ['status'], '_id='+id, null, null, null, function(err, results, fields)
	{
		if(err)
		{
			//the order not exists
			callback(err, results, fields);
		}
		else if(!results || results.length <= 0)
		{
			err = new Error('ER_NO_SUCH_ORDER_ERROR: No such order');
			callback(err, null, null);
		}
		else
		{
			//check status
			var status = results[0].status;
			if(status != 0)
			{
				err = new Error('ER_NO_PERMISSION_ERROR: Can not delete the order');
				callback(err, null, null);
			}
			else
			{
				db.delete(ORDERS, '_id='+id, callback);
			}
		}
	});
}

/**
查询客户订单数量
*/
function clientOrdersCountGet(client_id, status, callback)
{
	client_id = db.escape(cliend_id);
	status = db.escape(status);
	var where = 'client_id='+client_id;
	if(status && status != null)
	{
		where += 'AND status='+status;
	}
	db.query(ORDERS, ['COUNT(*)'], where, null, null, null, callback);
}

/**
管理员登录
*/
function adminLogin(username, password, callback)
{
	username = db.escape(username);
	password = db.escape(password);
	db.query(ADMINS, ['_id'], 'name='+username+' AND password='+password, null, null, null, callback);
}

/**
管理员注册
*/
function adminRegister(username, password, callback)
{
	db.insert(ADMINS, ['name', 'password'], ['\''+username+'\'', '\''+password+'\''], callback);
}

/**
管理员信息修改（修改密码）
*/
function adminInfoPatch(id, old_password, password, callback)
{
	id = db.escape(id);
	db.query(ADMINS, ['password'], '_id='+id, null, null, null, function(err, results, fields)
	{
		if(err)
		{
			//exception
			callback(err, results, fields);
		}
		else if(!results || results.length <= 0)
		{
			//the admin not exists
			err = new Error('ER_NO_SUCH_ADMIN: No such admin');
			callback(err, null, null);
		}
		else
		{
			//old password is right
			if(old_password && rows[0].password == old_password)
			{
				db.update(ADMINS, ['password'], ['\''+password+'\''], '_id='+id, callback);
			}
			//old password is wrong
			else
			{
				err = new Error('ER_NO_PERMISSION_ERROR: Old password is wrong');
				callback(err, null, null);
			}
		}
	});
}

/**
查询所有订单
*/
function adminOrdersGet(start, count, status, client_id, callback)
{
	status = db.escape(status);
	client_id = db.escape(cliend_id);
	var where = null;
	if(status && status != null)
	{
		where += 'status='+status;
	}
	if(client_id && cliend_id != null)
	{
		if(where && where.length > 7)
			where += ' AND ';
		where += 'client_id='+client_id; 
	}
	queryOrder(null, where, null, null, [start, count], callback);
}

/**
插入进货订单
*/
function adminOrdersPut(admin_id, create_time, goods_json, callback)
{
	clientOrdersPut(-1, create_time, 'admin', admin_id, 'null', goods_json, callback);
}

/**
修改订单状态
1->2 待发货->待收获
*/
function adminOrdersPatch(id, callback)
{
	id = db.escape(id);
	db.query(ORDERS, ['status'], '_id='+id, null, null, null, function(err, results, fields)
	{
		if(err)
		{
			//exception
			callback(err, results, fields);
		}
		if(!results || results.length <= 0)
		{
			//the order not exists
			err = new Error('ER_NO_SUCH_ORDER: No such order');
			callback(err, null, null);
		}
		else
		{
			var status = results[0].status;
			if(status == 1)
			{
				db.update(ORDERS, ['status'], [2], '_id='+id, callback);
			}
			else
			{
				err = new Error('ER_NO_PERMISSION_ERROR: Can not change the status of the order');
				callback(err, null, null);
			}
		}
	});
}

/**
查询账单
*/
function adminBillsGet(start, count, callback)
{
	db.query(BILLS, null, null, null, null, [start, count], callback);
}

/**
插入进货账单
@deprecated
*/
function adminBillsPut(order_id, goods_id, goods_count, goods_money, time, callback)
{
	var columns = ['order_id', 'goods_id', 'goods_count', 'goods_money', 'time'];
	var time = date.now();
	var values = [order_id, goods_id, goods_count, goods_money, '\''+time+'\''];
	db.insert(BILLS, columns, values, callback);
}

/**
查询商品详情
*/
function goodsGet(id, callback)
{
	id = db.escape(id);
	db.query(GOODS, null, '_id='+id, null, null, null, callback);
}

/**
插入商品
*/
function goodsPut(name, type, price, description, service, imgs, props, callback)
{
	name = db.escape(name);
	type = db.escape(type);
	var columns = ['name', 'type', 'price', 'description', 'service', 'imgs', 'props'];
	var values = [name, type, price, '\''+description+'\'', '\''+service+'\'', '\''+imgs+'\'', '\''+props+'\''];
	if((!name) || (!type) )
	{
		var err = new Error('Name or type is invalid');
		callback(err, null, null);
		return;
	}
	else
	{
		db.query(GOODS, null, 'name='+name+' AND type='+type, null, null, null, function(err, results, fields)
		{
			if(err)
			{
				//exception
				console.log('error', err);
				callback(err, results, fields);
			}
			else if(results && results.length >= 1)
			{
				err = new Error('ER_ILLEGAL_NAME_ERROR: The name in this type has existed');
				console.log('error', err);
				callback(err, null, null);
			}
			else
			{
				console.log('ok, insert the goods');
				db.insert(GOODS, columns, values, callback);
			}
		});
	}
	
}

/**
修改商品信息
*/
function goodsPatch(id, name, type, price, description, service, imgs, props, callback)
{
	name = db.escape(name);
	type = db.escape(type);
	var columns = [];
	var values = [];
	if(name && name != null)
	{
		columns.push('name');
		values.push(name);
	}
	if(type && type != null)
	{
		columns.push('type');
		values.push(type);
	}
	if(price && price != null)
	{
		columns.push('price');
		values.push(price);
	}
	if(description && description != null)
	{
		columns.push('description');
		values.push('\''+description+'\'');
	}
	if(service && service != null)
	{
		columns.push('service');
		values.push('\''+service+'\'');
	}
	if(imgs && img != null)
	{
		columns.push('imgs');
		values.push('\''+imgs+'\'');
	}
	if(props && props != null)
	{
		columns.push('props');
		values.push('\''+props+'\'');
	}
	if((!name) || (!type) )
	{
		db.update(GOODS, columns, values, '_id='+id, callback);
	}
	else
	{
		// db.query(GOODS, null, null, 'name='+name+' AND type='+type, null, null, null, function(err, results, fields)
		// {
		// 	if(err)
		// 	{
		// 		//exception
		// 		callback(err, results, fields);
		// 	}
		// 	else if(results && results.length >= 1)
		// 	{
		// 		err = new Error('ER_ILLEGAL_NAME_ERROR: The name in this type has existed');
		// 		callback(err, null, null);
		// 	}
		// 	else
		// 	{
				db.update(GOODS, columns, values, '_id='+id, callback);
		// 	}
		// });
	}
}
	
/**
删除商品，bills对goods有主键依赖
*/
function goodsDelete(goods_id, callback)
{
	goods_id = db.escape(goods_id);
	db.delete(GOODS, '_id='+goods_id, callback);
}

/**
商品库存数量查询
*/
function goodsCountGet(goods_id, callback)
{
	goods_id = db.escape(goods_id);
	db.query(REPO, ['count'], 'goods_id='+goods_id, null, null, null, callback);
}

/**
特定种类商品详情查询
*/
function goodsTypeGet(type, start, count, callback)
{
	var where;
	if(type && type != null)
	{
		type = db.escape(type);
		where = 'type='+type;
	}
	else
	{
		where = null;
	}
	
	db.query(GOODS, null, where, null, null, [start, count], callback);
}

/**
特定种类商品数量查询
*/
function goodsTypeCountGet(type, callback)
{
	type = db.escape(type);
	db.query(GOODS, ['COUNT(*)'], 'type='+type, null, null, null, callback);
}

exports.init = init;
exports.checkTables = checkTables;
exports.close = close;

exports.clientLogin = clientLogin;

exports.clientRegister = clientRegister;

exports.clientInfoGet = clientInfoGet;
exports.clientInfoPatch = clientInfoPatch;

exports.clientOrdersGet = clientOrdersGet;
exports.clientOrdersPut = clientOrdersPut;
exports.clientOrdersPatch = clientOrdersPatch;
exports.clientOrdersDelete = clientOrdersDelete;
exports.clientOrdersCountGet = clientOrdersCountGet;

exports.adminLogin = adminLogin;

exports.adminRegister = adminRegister;

exports.adminInfoPatch = adminInfoPatch;

exports.adminOrdersGet = adminOrdersGet;
exports.adminOrdersPut = adminOrdersPut;
exports.adminOrdersPatch = adminOrdersPatch;

exports.adminBillsGet = adminBillsGet;
exports.adminBillsPut = adminBillsPut;

exports.goodsGet = goodsGet;
exports.goodsPut = goodsPut;
exports.goodsPatch = goodsPatch;
exports.goodsDelete = goodsDelete;

exports.goodsCountGet = goodsCountGet;

exports.goodsTypeGet = goodsTypeGet;

exports.goodsTypeCountGet = goodsTypeCountGet;
