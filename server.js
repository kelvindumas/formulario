//Declaring express variable that will store the Express Library
var express = require("express");
//Declaring variable that will create an Express application
var app = express();
//Variable that will import the database module, presented in database.js
var connection = require('./database');
//Import the path module for working with file paths
var path = require('path');
//Setting up a static middleware to serve files from the public directory
//We had to set it to public, because for some reason it was not working
app.use(express.static('public'));
//Enable parsing of URL-encoded data in the request body
app.use(express.urlencoded({extended:true}));
//Defining a route for the root URL to serve the form.html file
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, 'form.html'));
});
//After the first forms being submitted, the css formating was gone, so below structure was adopted
//Defining a route for serving the style.css file
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css');//Setting the response header for CSS content
  res.sendFile(__dirname + '/style.css');//Sending the style.css file
});
//Defining a route for handling form submisssion via POST request
app.post('/submit', function(req, res){
    //Extract form data from the request body
    const {first_name, surname, email, phone_number, eircode}  = req.body;
    //Here we started the validation of the data
    //FIrst name must be alphanumeric and of length 20 characters max.
    if (!/^[A-Za-z0-9]{1,20}$/.test(first_name)) {
        return res.send("First Name must be alphanumeric, less than 20 characters.");//Display message in case user inputs wrong data
      }
    //FIrst name must be alphanumeric and of length 20 characters max.
      if (!/^[A-Za-z0-9]{1,20}$/.test(surname)) {
        return res.send("Surname must be alphanumeric, less than 20 characters.");//Display message in case user inputs wrong data
      }
    //Email must follow the correct email structure, therefore we cna use the emailRegex
    //Allowing lowercase before '@' and making sure user inputs '@' and something after and before the '.'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.send("Please enter a valid email address!");//Display message in case user inputs wrong data
      }
      //Phone number must has only numeric characters and max 10 numbers
      if (!/^\d{10}$/.test(phone_number)) {
        return res.send("Phone number must have only numbers up to 10 digits.");//Display message in case user inputs wrong data
      }
      //Eircode must start with a number and have more 5 characters (numbers or letters.)
      if (!/^[0-9][A-Za-z0-9]{5}$/.test(eircode)) {
        return res.send("Eircode must start with a number,and must has up to 6 digits.");//Display message in case user inputs wrong data
      }
      //If all validation passes, insert form data into our database 
    if(first_name && surname && email && phone_number && eircode){
        //Declaring sql variable that uses sql statement to insert into our table pior created
        const sql = "INSERT INTO mysql_table (first_name, surname, email, phone_number, eircode) VALUES(?, ?, ?, ?, ?)";
        connection.query(sql, [first_name, surname, email, phone_number, eircode], function(err, results){
            //If insert into the table fails, thrown an error message
            if (err) {
                console.error("Error inserting data:", err);
                return res.status(500).send("Error: Could not insert data into the database");
            }
            //Otherwise, display that form was submitted successfully!
            res.send("Form submitted successfully!");
        });
    }else{
      //In case one of the validations go wrong, display also this message
        return res.send("Please try again, make sure all required fields are filled in!")
    }
})
// Start the Expresss application on port 3000
//Where we are hosting our localhost
app.listen(3000, function(){
    console.log("App Listening on port 3000")//Display that App is letining on port 3000 on terminal
    //Establish a connection to the database when the application starts
    connection.connect(function(err){
        if(err) throw err;
        console.log('Database has been connected!')//display the database was connected on terminal
    })
})