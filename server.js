var express = require('express');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var app = express();

var config = {
  user:'postgres',
  password: 'postgres',
  database:'mecprint',
  port:'5432',
  host:'localhost'
}

app.use(express.static('public'));

var pool = new Pool(config);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'landing.html'));
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
app.get('/public/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'css', 'style.css'));
});
app.get('/public/assets/mec.png', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'mec.png'));
});
app.get('/public/js/javascript.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'javascript.js'));
});
app.get('/admin.html', function (req, res) {
  res.sendFile(path.join(__dirname,'admin.html'));
});
app.get('/user.html', function (req, res) {
  res.sendFile(path.join(__dirname,'user.html'));
});
app.get('/public/css/user_style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'css', 'user_style.css'));
});

app.get('/testdb',function(req,res){
  pool.query('SELECT * FROM users',function(err,result){
    if(err){
      res.status(500).send(err.toString());
    } else {
      res.send(JSON.stringify(result));
    }
  })
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
  pool.query('INSERT INTO "users" (username,password,phone) VALUES ($1,$2,$3)',[username,password,phone],function(err,result){
    if(err){
      res.status(500).send(err.toString());
    } else {
      res.send('User successfully created');
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
        res.status(403).send("Username invalid");
      }else{
        var dbstr = result.rows[0].password;
        var salt = dbstr.split('$')[2];
        var hashedPass = hash(password,salt);
        if(hashedPass==dbstr){
          res.send('User logged in');
      }else{
        res.status(403).send('Password invalid');
      }
        
      }
      
    }   
  });
});
app.listen(3000);

