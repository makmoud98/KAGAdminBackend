var tools = require("./tools");
var database = require("./database");

/*
create table admin_ban (
  id INT(11) NOT NULL AUTO_INCREMENT,
  admin VARCHAR(20) DEFAULT NULL,
  player VARCHAR(20) DEFAULT NULL,
  time VARCHAR(30) DEFAULT NULL,
  length INT(11) DEFAULT NULL,
  reason VARCHAR(100) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB;
*/

function admin_bans (){
	/*
		this checks for 2 commands,
		*the ban command
			ban just logs a ban into the database and send the ban command to all servers connected.
			the database keeps track of the admin, banned player, date of ban, length of ban, and reason of ban
		ex: |BACKEND| ban;makmoud98;copper40;1440;griefs flag room etc, etc
						^	   ^		^		^	   		   ^
					 command admin	  player   length	     reason
			needs to be sent with tcpr method
		*the getban command 
			getban writes information to the server that sent the command about the player's ban record (all previous and currents ban ever)
			atm i dont know how geti wants to get the data through the front end. maybe some use of CBitStream im thinking
		ex: |BACKEND| getban;copper40
						^	    ^
					 command  player 
			needs to be sent with tcpr method
	*/
	this.onData = function (data, num){
		var command = tools.getCommand(data);
		if(command == false){
			return;
		}
		if(command.length == 5){
			if(command[0] == "ban"){
				var admin  = command[1];
				var player = command[2];
				var d = new Date();
				var dateandtime = d.toUTCString();
				var length = command[3];
				var reason = command[4].substr(0, 100);//100 char max
				database.query("insert into admin_bans set ?", {admin: admin, player: player, time: dateandtime, length: length, reason:reason}, function (err, result){
					if(err){
						throw err;
					}
				});
				tools.writeToAllServers("/ban " + player + " " + length + " " + reason);
				tools.sendToIRC("admin " + admin + " banned " + player + " for " + length + " minutes. reason: " + reason);
			}
		}
		else if(command.length == 2){
			if(command[0] == "getban"){
				var player = command[1];
				database.query("select * from admin_bans where player = ?", [player], function (err, rows){
					if(err){
						throw err;
					}
					var all_ban_info = "";
					for (var i = 0; i < rows.length; i++) { 
						var ban = rows[i];
						all_ban_info = all_ban_info + "|" + ban.player + "/" + ban.admin + "/" + ban.length + "/" + ban.time + "/" + ban.reason;
					};

					tools.write(all_ban_info, num);//need to speak with geti to see how he wants to get the info
				});
			}
		}
	}
};

module.exports = new admin_bans();