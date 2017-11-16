var servers = require("./servers");
var net = require('net');
var tools = require("./tools");
var mods = require("./mods");

function Connection (host, port, pass, num){
	var self = this;
	var socket = new net.Socket();
	var connected = false;
	var retry = 0;
	var que = [];

	this.connect = function (callback){
		retry++;
		socket.connect(port, host, callback);
	};

	this.write = function (command){
		que.push(command);
	};

	socket.on('connect', function (){
		retry = 0;
		connected = true;
		tools.log("connected to " + host + ":" + port, num);
		socket.write(pass + "\n");

		for(var i = 0; i < mods.length; i++)
		{
			if(typeof mods[i].onConnect === "function"){
				mods[i].onConnect(num);				
			}
		}
	})

	socket.on('data', function (data){
		var input = (data.toString());
		input = input.substring(0,input.length-1);//takes out the next line character
		
		for(var i = 0; i < mods.length; i++)
		{
			if(typeof mods[i].onData === "function"){
				mods[i].onData(input, num);				
			}
		}
	});

	socket.on('close', function (had_error){
		connected = false;
		tools.log("closed connection from " + host + ":" + port, num);
		if(que.length > 0){
			tools.log("warning: " + que.length + " commands are still in the que for " + host + ":" + port, num);
		}
		setTimeout(function (){
			tools.log("attempt# " + retry + " to reconnect to " + host + ":" + port, num);
			self.connect();
		}, 5000);

		for(var i = 0; i < mods.length; i++)
		{
			if(typeof mods[i].onClose === "function"){
				mods[i].onClose(input, num);				
			}
		}
	});

	socket.on('error', function (err){
		tools.log(err, num);
	});

	setInterval(function () {
		if(connected && que.length > 0){
			var cmd = que.shift();
			if(socket.write(cmd + "\n")){
				tools.log("write: " + cmd, num);
			}
			else{
				que.unshift(cmd);
				tools.log("couldn't write to server, will retry", num);
			}
		}
	}, 500);
}

function Connections (){
	var clients = [];
	for(var i = 0; i < servers.length; i++)
	{
		clients[i] = new Connection(servers[i][0], servers[i][1], servers[i][2], i);
		clients[i].connect();
	};
	return clients;
};

module.exports = new Connections;