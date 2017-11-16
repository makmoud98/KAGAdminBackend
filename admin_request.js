var tools = require("./tools");
var servers = require("./servers");
var ircbot = require("./ircbot");

function admin_request (){
	this.onData = function (data, num){
		var command = tools.getCommand(data);
		if(command != false && command.length == 3){
			if(command[0] == "requestadmin"){
				tools.log(command[1] + " requested an admin. reason: " + command[2], num);
				tools.sendToIRC(command[1] + " needs help! reason: " + command[2] + " https://poc.kag2d.com/joinserver/joinserver.php?IPAddress=" + servers[num][0] + "&port=" + servers[num][1] + "");				
				ircbot.pingAll();
				tools.writeToAllServers("something here to alert all servers");
			}
		}
	}
};

module.exports = new admin_request();