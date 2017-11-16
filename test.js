var main = require("./main");
var tools = require("./tools");
var database = require("./database");

function test (){
	this.onData = function (data, num){
		tools.log(data, num);
	}
};
module.exports = new test();