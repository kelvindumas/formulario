//Importing mysql module to use its functionality for working with MYSQL databases
var mysql = require("mysql");
//Using the create connection method to create a connection object with MYSQL database
//connection details (host, database name, user, and password)
//All these credentials prior defined on the MYSQL workbench
var connection = mysql.createConnection({
    host: "localhost",
    database:"mysql_db",
    user:"root",
    password:"password"

})
//Exportting the connection object so that it can be imported and used in other parts of our peoject
//The same connection is called on server.js to allow connectivity
module.exports = connection;