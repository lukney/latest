var http = require("http");
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');


var connection = mysql.createConnection({
  /*host     : 'super.cgcpmi6mcuyv.us-east-2.rds.amazonaws.com', 
  user     : 'super', //mysql database user name
  password : '7276947408', //mysql database password
  database : 'super', //mysql database name
  port     : '3306'*/
host     : 'nemai1234.cyelmj7smxyj.us-east-1.rds.amazonaws.com', //mysql database host name
  user     : 'nemai1234', //mysql database user name
  password : 'nemai1234', //mysql database password
  database : 'nemai1234', //mysql database name
port : '3306'   
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})
//end mysql connection

//start body-parser configuration
app.use( bodyParser.json() )       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))
//end body-parser configuration

//create app server
var server = app.listen(3008,   function () {

  //var host = 'ec2-user@ec2-52-70-73-41.compute-1.amazonaws.com'
  var host = 'ec2-54-147-43-135.compute-1.amazonaws.com'
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});

//https selectusser:get method
app.get('/selectuser', function (req, res) {
   connection.query('select * from users', function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});

//register user
app.post('/register', function (req, res) {
	bcrypt.hash(req.body.pwd, 5, function( err, bcryptedpwd) { 
        var reg = {
        "first_name":req.body.first_name,
		"last_name":req.body.last_name,
		"email_id" : req.body.email_id,
		phone : req.body.phone,
		gender : req.body.gender,
		dob : req.body.dob,
		city : req.body.city,
        pwd:bcryptedpwd
		};
    connection.query('INSERT INTO users SET ?',reg, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some error with query'
        })
      }else{
    console.log('The solution is: ', results);
    res.send({
      "code":200,
      "success":"user registered sucessfully"
        });
  }
    });

});
});//destination api
  var distance = require('google-distance-matrix');
app.use(bodyParser.json());


app.post('/destinationapi', function (req, res){
	var origins=[req.body.origins]; 
	var destinations=[req.body.destinations];
   var dist;
  var user_gms=req.body.user_gms;
distance.key('AIzaSyAykFlST8qAZY7EzGLEN4lTTNpPirenuVE');
distance.units('metric');

distance.matrix(origins, destinations, function (err, distances) {
  
        

if (distances.status == 'OK') {
        for (var i=0; i < origins.length; i++) {
            for (var j = 0; j < destinations.length; j++) {
                var origin = distances.origin_addresses[i];
                var destination = distances.destination_addresses[j];
                if (distances.rows[0].elements[j].status == 'OK') {
                    var  dist = distances.rows[i].elements[j].distance.text;
					console.log(dist);
                    console.log('Distance from ' + origin + ' to ' + destination + ' is ' + dist);
					
					    res.end(JSON.stringify(dist));
					 
						
				}
					
                 else {
                    console.log(destination + ' is not reachable by land from ' + origin);
                }
            }
        }
    }
}); 

 
});

//login user
app.post('/login', function (req, res) {
	 var email_id=req.body.email_id;
    var pwd=req.body.pwd;
	
	connection.query('SELECT * FROM users WHERE email_id = ?',[email_id],function(err,results){
  if (err) {
   console.log(err);
  }else{
    if(results.length >0){
		
		bcrypt.compare(pwd, results[0].pwd, function(err, doesMatch) {
			console.log(results[0].pwd);
    // res == true
	
        if (doesMatch){
     res.send({
       "code":200,
       "success":"login sucessfull"
         });
      }else{
     res.send({
       "code":204,
       "success":"password does not match"
         });
      } 
});
	}
	
	 else{
      res.send({
        "code":204,
        "success":"Email does not exits"
          });
    }
  }
  });
});
  //user already existed
  app.post('/alreadyexists', function (req, res) {
	 var email_id=req.body.email_id;
    var phone=req.body.phone;
	
	connection.query('SELECT * FROM users WHERE email_id = ?',[email_id],function(err,results){
  if (!err) {
   res.json({
            status:true,
            message:'user already exists'
        })
  }else{
    connection.query('SELECT * FROM users WHERE phone = ?',[phone],function(err,results){
		 if (!err) {
  res.json({
            status:true,
            message:'user already exists'
        })
  }
});
  }	
  });
  });	
app.post('/insert', function (req, res) {
	//get data
    var data = {
        name: req.body.name,
        mobileno: req.body.mobileno,
       
     };
   connection.query("INSERT INTO user set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });
});