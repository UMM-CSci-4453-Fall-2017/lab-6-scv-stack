// Connect to the server and print the contents of each of the databases.

var credentials = require('./credentials.json');
var mysql = require('mysql');
var async = require('async');

credentials.host="ids";
var connection = mysql.createConnection(credentials);

connection.connect(function(err){
  if(err){
    console.log("Error: " + err);
  } else {
    console.log("Connected to Database.");
  }
});

function printDatabases(connection, callback_1, callback_2) {
  connection.query("SHOW DATABASES", function(err, rows, fields){
    if(err){
      console.log("Error: " + err);
    } else {
      for (var e in rows) {
        (function(e) {
	  var database = rows[e].Database;
          console.log("---|" + database + ">");
          callback_1(database, callback_2);
        })(e);
      }
      }
  });  
}

function printTables(database, callback) {
  connection.query("SHOW TABLES IN " + database,
	  function(err, rows, fields) {
    if(err){
      console.log("Error: " + err);
    } else {
      var tableString = "rows[e].Tables_in_" + database;
      for (var e in rows) {
        (function(e) {
	  console.log(".....|" + database + "." + 
          	eval(tableString) + ">");
          callback(database, eval(tableString));
	})(e);
      }
    }
  });
}

function printTableStructure(database, table) {
  connection.query("DESCRIBE " + database + "." + table, function(err, rows, fields) {
    if(err){
      console.log("Error: " + err);
    } else {
	for (var e in rows) {
          (function(e) {
	     var field = rows[e].Field;
	     var type = rows[e].Type;
	     // 11 spaces default for the padding, unless the field string is greater, then just give it 30 spaces and split from that
	     var padding = "           ";
 	     if (field.length > padding.length) {
	       padding = "                              ";
	       padding = padding.slice(field.length);
	     } else {
	       padding = padding.slice(field.length);
	       }
	     console.log("       FieldName: `" + field + "`" + padding + "(" + type + ")");
          })(e);	    
        }
      }	    
  });
}

printDatabases(connection, printTables, printTableStructure);
