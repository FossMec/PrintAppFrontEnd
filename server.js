const express = require('express');
const path = require('path');
const fs = require("fs");
const bodyParser = require('body-parser');
const Pool = require('pg').Pool;
const crypto = require('crypto');
const session = require('express-session');
const formidable = require('formidable');


var options = {
    media: 'Custom.200x600mm',
    n: 3
};

// Get available printers list
console.log("Available Printers " + Printer.list(1));

var printer = new Printer(`${Printer.list(1)}`);


var app = express();
app.use(session({
  secret:"someRandomValue",
  cookie:{maxAge: 1000*60*60*24*30}
}));
var config = {
  user:'postgres',
  password: 'postgres',
  database:'mecprint',
  port:'5432',
  host:'localhost'
}

app.use(express.static('public'));
app.use(bodyParser.json());

var pool = new Pool(config);

app.get('/', function (req, res) {
  if(req.session && req.session.auth && req.session.auth.userID){
    res.status(200).redirect('/user.html');
  }else{
    res.status(403).sendFile(path.join(__dirname,'landing.html'));
  }
});
app.get('/public/css/home_style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'css', 'home_style.css'));
});
app.get('/public/assets/test1.jpeg', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'test1.jpeg'));
});
app.get('/login.html', function (req, res) {
  res.sendFile(path.join(__dirname,'login.html'));
});
app.get('/register.html', function (req, res) {
  res.sendFile(path.join(__dirname,'register.html'));
});
app.get('/public/js/pdf.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'pdf.js'));
});
app.get('/public/js/pdf.worker.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'pdf.worker.js'));
});
app.get('/public/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'css', 'style.css'));
});
app.get('/public/assets/mec.png', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'mec.png'));
});
app.get('/public/js/javascript.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'javascript.js'));
});
app.get('/public/js/loginjs.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'loginjs.js'));
});
app.get('/public/js/adminjs.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'adminjs.js'));
});
app.get('/public/js/registerjs.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'registerjs.js'));
});
app.get('/admin.html', function (req, res) {
  if(req.session && req.session.auth && req.session.auth.userID){
    res.status(200).sendFile(path.join(__dirname,'admin.html'));
  }else{
    res.status(403).redirect('/login.html');
  }
});


app.get('/user.html', function (req, res) {
  res.status(200).sendFile(path.join(__dirname,'user.html'));

  if(req.session && req.session.auth && req.session.auth.userID){
    res.status(200).sendFile(path.join(__dirname,'user.html'));
  }else{
    res.status(403).redirect('/login.html');
  }
});


app.get('/public/assets/pdf1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'pdf1.jpg'));
});
app.get('/public/css/user_style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'css', 'user_style.css'));
});
app.get('/public/js/pdf_edit.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'pdf_edit.js'));
});
app.get('/public/js/userjs.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'userjs.js'));
});
app.get('/testdb',function(req,res){
  pool.query('SELECT * FROM users',function(err,result){
    if(err){
      res.status(500).send(err.toString());
    } else {
      res.send(JSON.stringify(result.rows));
    }
  });
});

function hash(input,salt){
  var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
  return ['pbkdf2Sync',10000,salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
  var hashedString = hash(req.params.input,'randomSalt');
  res.send(hashedString);
});
app.post('/create-user',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var phone = req.body.phone;
  var salt = crypto.randomBytes(128).toString('hex');
  var dbstr = hash(password,salt);
  pool.query('INSERT INTO "users" (username,password,phone) VALUES ($1,$2,$3)',[username,dbstr,phone],function(err,result){
    if(err){
      res.status(500).send(err.toString());
      console.log(err);
    } else {
      res.status(200).send('user created');
      console.log('user created');
      console.log(result);
    }
  });
});



app.post('/login-user',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  pool.query('SELECT * FROM "users" WHERE username = $1',[username],function(err,result){
    if(err){
      res.status(500).send(err.toString());
    } else {
      if (result.rows.length == 0){
        res.status(403).send('username invalid');
        console.log("Username invalid");
      }else{
        var dbstr = result.rows[0].password;
        var salt = dbstr.split('$')[2];
        var hashedPass = hash(password,salt);
        if(hashedPass==dbstr){
          req.session.auth = {userID:result.rows[0].id};
          res.status(200).send("user logged in");
          console.log('user logged in');
      }else{
        res.status(403).send('password invalid');
        console.log('Password invalid');
      }

      }

    }
  });
});



app.get('/check-login',function(req,res){
  if(req.session && req.session.auth && req.session.auth.userID){
    res.status(200).send("Logged in");
  }else{
    res.status(403).send("Not logged in");
  }
});



app.get('/logout',function(req,res){
  delete req.session.auth;
  res.status(200).redirect('/login.html');
});


app.post('/add-credits',function(req,res){
  var phone = req.body.phone;
  var credits = req.body.credits;
  pool.query('SELECT * FROM "users" WHERE phone = $1',[phone],function(err,result){
    if(err){
      res.status(500).send(err.toString());
    } else {
      if (result.rows.length == 0){
        res.status(403).send('phone invalid');
        console.log("phone invalid");
      }else{
        credits = parseInt(credits) + parseInt(result.rows[0].credits);
        console.log(credits,result.rows[0].credits);
        pool.query('UPDATE "users" SET credits = $1  WHERE phone = $2',[credits,phone],function(err,result){
          if(err){
            res.status(500).send(err.toString());
          }else{
                res.status(200).send('Credits added')
                console.log('credits added',credits);
            }
      
      
      
        });
      }

      }
  });
 
});

app.get('/fetch-user-data',function(req,res){
  pool.query('SELECT * FROM users WHERE id=$1',[req.session.auth.userID],function(err,result){
    if(err){
      res.status(500).send(err.toString());
    } else {
      res.status(200).send(JSON.stringify({credits:result.rows[0].credits,history:result.rows[0].history}));
    }
  });
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});
app.listen(3000);
