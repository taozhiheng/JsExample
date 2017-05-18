//file: db.js
//author: persist
//purpose: test mysql

var mysql  = require('mysql');  //调用MySQL模块
var RowDataPacket = require('mysql/lib/protocol/packets/RowDataPacket');
var FieldPacket = require('mysql/lib/protocol/packets/FieldPacket');
	var error = new Error('ER_BAD_FIELD_ERROR: Unknown column \'a\' in \'fieldlist\'');
	
	
	var error2 = new Error('ER_BAD_FIELD_ERROR: Unknown column \'a\' in \'fieldlist\'');
	
	error2.code = 'ER_BAD_FIELD_ERROR';
	error2.errno = 1054;
	error2.sqlState = '42S22';
	error2.index = 0;
	
	var row = new RowDataPacket();
	var field = new FieldPacket(null);

	console.log(error.constructor.toString());
	console.log(error);
	
	console.log((error == error2));
 
//创建一个connection
var connection = mysql.createConnection({    

host     : 'localhost',	//主机

user     : 'root',		//MySQL认证用户名

password : 'password',	//MySQL认证用户密码

port	 : '3306',		//端口号

database : 'mysql'

});

//创建一个connection
connection.connect(function(err){

if(err){       

console.log('[query] - :'+err);

return;

}

console.log('[connection connect]  succeed!');

}); 



//执行SQL语句
connection.query('SELECT COUNT(*) FROM clients limit 20', function(err, rows, fields) {

	

	if (err) {

		return;
	}
	
	console.log(fields[0].name);
	
	console.log(rows[0][fields[0].name]);
	
	for(var i = 0; i < rows.length; i++)
	{
		console.log(rows[i]); 
	}
	
	

}); 

//关闭connection
connection.end(function(err){

	if(err){       

		return;

	}

	console.log('[connection end] succeed!');

});