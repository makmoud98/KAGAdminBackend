var tools = require("./tools");
var database = require("./database");
var servers = require("./servers");

/*
create table admin_join ( 
 id int(11) NOT NULL AUTO_INCREMENT,   
 name varchar(20),   
 time varchar(10) )
*/

function admin_join (){
	/*
		this entire thing is fairly simple,
		*join command
			just puts the current date and time in the database to keep track of active admins
			it looks like |BACKEND| join;makmoud98
		*lastjoined command
			will send the server info about the last joined time of an admin
			|BACKEND| lastjoined;makmoud98		
	*/
	this.onData = function (data, num){
		var command = tools.getCommand(data);
		if(command != false && command.length == 2){
			if(command[0] == "join"){
				var d = new Date();
				var dateandtime = d.toUTCString();
				var newadmin = false;
				database.query("select * from admin_join where name = ?", [command[1]], function (err, result){
					if (err){
						throw err;
					}
					if(result.length == 0){
						newadmin = true;
					}
					if(newadmin){
						database.query("insert into admin_join set ?", {name:command[1], time:dateandtime}, function (err, result){
							if (err){
								throw err;
							}
						});
					}
					else{
						database.query("update admin_join set time = ? where name = ?", [dateandtime,command[1]], function(err, result){
							if (err){
								throw err;
							}
						})
					}
				});
				tools.sendToIRC("admin " + command[1] + " has just joined " + servers[num][0] + ":" + servers[num][1]);
			}
			else if(command[0] == "leave"){

			}
			else if(command[0] == "lastjoined"){
				database.query("select * from admin_join where name = ?", [command[1]], function (err, result){
					if(err){
						throw err;
					}

					var message = 0;

					if(result.length == 1){
						message = result[0].time;
						tools.write(message, num);
					}
				});
			}
		}
	}
};
module.exports = new admin_join();