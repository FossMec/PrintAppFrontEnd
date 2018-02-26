var express = require('express');
var path = require('path');
var fs = require("fs");
var bodyParser = require('body-parser');
var multer  = require('multer');

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(multer({ dest: '/tmp/'}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'landing.html'));
});
app.get('/public/css/home_style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'css', 'home_style.css'));
});
app.get('/public/assets/test1.jpeg', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'test1.jpeg'));
});
app.get('/public/assets/grass.jpeg', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'grass.jpeg'));
});
app.get('/public/assets/pdf1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'pdf1.jpg'));
});
app.get('/login.html', function (req, res) {
  res.sendFile(path.join(__dirname,'login.html'));
});
app.get('/public/js/pdf.worker.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'pdf.worker.js'));
});
app.get('/public/js/pdf.js', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'js', 'pdf.js'));
}); 
app.get('/public/css/style.css', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'css', 'style.css'));
});
app.get('/public/assets/mec.png', function (req, res) {
  res.sendFile(path.join(__dirname,'public', 'assets', 'mec.png'));
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
app.post('/file_upload', function (req, res) {
   var file = __dirname + "/" + req.files.file.name;
   
   fs.readFile( req.files.file.path, function (err, data) {
      fs.writeFile(file, data, function (err) {
         if( err ){
            console.log( err );
            }else{
               response = {
                  message:'File uploaded successfully',
                  filename:req.files.file.name
               };
            }
         console.log( response );
         res.end( JSON.stringify( response ) );
      });
   });
});
app.listen(3000);

