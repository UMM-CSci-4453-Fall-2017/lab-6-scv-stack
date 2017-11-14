// Connect to the server and print the contents of each of the databases.

var credentials = require('./credentials.json');
var mysql = require('mysql');

credentials.host="ids";
var connection = mysql.createConnection(credentials);

connection.connect(function(err){
  if(err){
    console.log("Error: " + err);
  } else {
    console.log("Connected to Database.");
  }
});

function summarizeDatabase(connection) {
  printDatabases(connection);
  
}

function printDatabases(connection) {
  connection.query("SHOW DATABASES", function(err, rows, fields){
    if(err){
      console.log("Error: " + err);
    } else {
        var print = function(count) {
	  if (count < rows.length) {
	    var database = rows[count].Database;
	    console.log("---|" + database + ">");
            printTables(database);
	    print(count+1);  
	  }
	};
	print(0);
      }
  }); 
}


function printTables(database) {
  connection.query("SHOW TABLES IN " + database,
	  function(err, rows, fields) {
    if(err){
      console.log("Error: " + err);
    } else {
        var print = function(count) {
	  if  (count < rows.length) {
	    var tableString = "rows[count].Tables_in_" + database;
	    console.log(".....|" + database + "." + 
          	  eval(tableString) + ">");
            printTableStructure(database, eval(tableString));
 	    print(count+1);
	  }
	};
	print(0);
      }
  });
}

function printTableStructure(database, table, count) {
  connection.query("DESCRIBE " + database + "." + table, function(err, rows, fields) {
    if(err){
      console.log("Error: " + err);
    } else {
          var print = function(count) {
	     if (count < rows.length) {
	       var field = rows[count].Field;
	       var type = rows[count].Type;
	       // 11 spaces default for the padding, unless the field string is greater, then just give it 30 spaces and split from that
	       var padding = "           ";
 	       if (field.length > padding.length) {
	         padding = "                              ";
	         padding = padding.slice(field.length);
	       } else {
	         padding = padding.slice(field.length);
	         }
	       console.log("       FieldName: `" + field + "`" + padding + "(" + type + ")");
	       print(count+1);
             }
	  };
	  print(0);
      }
  });
}

summarizeDatabase(connection);
