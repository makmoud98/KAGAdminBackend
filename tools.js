function Tools() {
	var clients = require("./connections");
	var irc = require("./ircbot");

	this.writeToAllServers = function (data) {
		for(var i = 0; i < clients.length; i++){
			clients[i].write(data);
		}
	};
	this.write =  function (data, num){
		clients[num].write(data);
	};
	this.sendToIRC =  function (data){
		irc.send(data);
	};
	this.log = function (input, num){
		var d = new Date();
		var h = d.getUTCHours();
		var m = d.getUTCMinutes();
		var s = d.getUTCSeconds();
		if(h < 10){
			h = "0" + h;
		}
		if(m < 10){
			m = "0" + m;
		}
		if(s < 10){
			s = "0" + s;
		}
		var time = "[" + h + ":" + m + ":" + s + "] ";
		if(num < 10){
			num = "0" + num;
		}
		console.log("[" + num + "] " + time + input);
	};
	this.getCommand =  function (data) {
		if(data.substring(11, 20) == "|BACKEND|"){
			var command = data.substring(21);
			return command.split("|");
		}
		return false;
	};
};

module.exports = new Tools();