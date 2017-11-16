var irc = require('irc');
var tools = require("./tools");

var bot_name = "OKSbot";
var bot_pass = "eRi8p8Qblw";
var channel_name = "#maktest";
var channel_pass = "";

function ircbot (name, channel, pass){
	var que = [];
	var client = new irc.Client('irc.quakenet.org', bot_name, {
    	channels: [channel + " " + pass], 
	});

	this.send = function (data){
		que.push(data);
	};

	this.pingAll = function (){
		var users = client.chans[channel_name].users;
		var list = "";
		for(user in users){
			if(user == client.nick){
				continue;
			}
			list = list + user + " ";
		}
		client.say(channel_name, list);
	}

	client.on("message", function (from, to, message){
		
	});

	client.on("registered", function (message) {
		client.say("Q@CServe.quakenet.org", "AUTH " + bot_name + " " + bot_pass);
		tools.log(bot_name + " has authed and connected to " + channel_name, "IRC");
	});

	setInterval(function () {
		if(que.length > 0){
			var msg = que.shift();
			client.say(channel_name, msg);
		}
	}, 500);
}

module.exports = new ircbot(bot_name, channel_name, channel_pass);