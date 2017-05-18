//filename: hashmap.js
//author: persist
//purpose: create hash map structure is js

function HashMap()
{
    this.put = function(key,value)
    {
    	this[key] = value
    };  

    this.get = function(key)
    {
    	return this[key]
    };

    this.contains = function(key)
    {
    	return this.get(key) == null?false:true
    };

    this.remove = function(key)
    {
    	delete this[key]
    };
}

exports.HashMap = HashMap;