//filename:	mysql.js
//author:	persist
//purpose:	used as a module to operate database

//import moduls
var mysql = require('mysql');

//global props
var m_config;
var m_connection;
var m_init;

//private
//auto reconnected when errors happen
function handleDisconnect()
{
	m_connection = mysql.createConnection(m_config);
	m_connection.connect(function(err)
	{
		if(err)
		{
			console.log("Reconnect: "+new Date());
			setTimeout(handleDisconnect, 2000);
			return;
		}
		console.log("Connected");
		m_init();
	});
	m_connection.on('error', function(err)
	{
		console.log('Database error', err);
		if(err.code == 'PROTOCOL_CONNECTION_LOST')
		{
			handleDisconnect();
		}
		else
		{
			throw err;
		}
	});
}

//export
//load config and create connection
function init(config_file, callback)
{
	//parse json
	var data = require(config_file);
	m_config = {
		host 		: data.host,
		user 		: data.user,
		password 	: data.password,
		port 		: data.port,
		database 	: data.database
	}
	m_init = callback;
	handleDisconnect();
}

//export
//close database
function close()
{
	if(m_connection)
	{
		m_connection.end(function(err)
		{
			if(err)
			{
				console.log('Close error');
				return;
			}
			console.log('Connection end succeed!');
		})
	}
}

//export
//create a table
function create(description, callback)
{
	if(!m_connection)
		return false;
	m_connection.query(description, callback);
	return true;
}

//export
//drop a table
function drop(table, callback)
{
	if(!m_connection)
		return false;
	var sql = [];
	sql.push('DROP TABLE ');
	sql.push(table);
	m_connection.query(sql.join(' '), callback);
	return true;
}

//export
//insert a record into a table
function insert(table, columns, values, callback)
{
	if(!m_connection)
		return false;
	var sql = [];
	sql.push('INSERT INTO ');
	sql.push(table);
	sql.push(' ( ');
	sql.push(columns[0]);
	var i = 0;
	for(i = 1; i < columns.length; i++)
	{
		sql.push(',');
		sql.push(columns[i]);
	}
	sql.push(' ) VALUES ( ');
	sql.push(values[0]);
	for(i = 1; i < values.length; i++)
	{
		sql.push(',');
		sql.push(values[i]);
	}
	sql.push(' )');
	console.log('insert', sql.join(' '));
	m_connection.query(sql.join(' '), callback);
	return true;
}

//export
//delete records from table
function del(table, where, callback)
{
	if(!m_connection)
		return false;
	var sql = [];
	sql.push('DELETE FROM ');
	sql.push(table);
	if(where)
	{
		sql.push(' WHERE ');
		sql.push(where);
	}
	console.log('delete', sql.join(' '));
	m_connection.query(sql.join(' '), callback);
	return true;
}

//export
//query records from table
function query(table, columns, where, group, order, limit, callback)
{
	if(!m_connection)
		return false;
	var sql = [];
	sql.push('SELECT ');
	if(columns)
	{
		sql.push(columns[0]);
		for(var i = 1; i < columns.length; i++)
		{
			sql.push(',');
			sql.push(columns[i]);
		}
	}
	else
	{
		sql.push(' * ');
	}
	
	sql.push(' FROM ');
	sql.push(table);
	if(where)
	{
		sql.push(' WHERE ');
		sql.push(where);
	}
	if(group)
	{
		sql.push(' GROUP BY ');
		sql.push(group);
	}
	if(order)
	{
		sql.push(' ORDER BY ');
		sql.push(order);
	}
	if(limit)
	{
		sql.push(' LIMIT ');
		sql.push(limit[0]);
		if(limit.length > 1 )
		{
			sql.push(',')
			sql.push(limit[1]);
		}
	}
	console.log('query: ', sql.join(' '));
	m_connection.query(sql.join(' '), callback);
	return true;
}

//export
//update records in table
function update(table, columns, values, where, callback)
{
	if(!m_connection)
		return false;
	var sql = [];
	sql.push('UPDATE ');
	sql.push(table);
	sql.push(' SET ');
	sql.push(columns[0]);
	sql.push('=');
	sql.push(values[0]);
	for(var i = 1; i < columns.length; i++)
	{
		sql.push(', ')
		sql.push(columns[i]);
		sql.push('=');
		sql.push(values[i]);
	}
	if(where)
	{
		sql.push(' WHERE ');
		sql.push(where);
	}
	console.log('update', sql.join(' '));
	m_connection.query(sql.join(' '), callback);
	return true;
}

function escape(sql)
{
	if(!sql || !m_connection)
		return sql;
	return m_connection.escape(sql);
}

exports.init = init;
exports.close = close;
exports.create = create;
exports.drop = drop;
exports.insert = insert;
exports.delete = del;
exports.query = query;
exports.update = update;
exports.escape = escape;
