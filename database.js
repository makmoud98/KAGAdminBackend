var mysql = require("mysql");

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "*****",
	database: "*****"
});
con.connect(function (err){
	if(err){
		console.log("error connecting to database " + err);
		return;
	}
});

module.exports = con;