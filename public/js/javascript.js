$( document ).ready(function() {
    $("#registerDiv").hide();
});
$("#registerNow").click(function(){
    $("#loginDiv").hide();
    $("#registerDiv").show();
});

document.getElementById('loginButton').onclick = function(){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == XMLHttpRequest.DONE){
            if(req.status == 200){
                console.log("user logged in");
            }else if(req.status == 403){
                console.log("username/password invalid");
            }else if(req.status == 500){
                console.log("something went wrong on the server");
            }
        }
    };
    var username = document.getElementById('loginusername').value;
    var password = document.getElementById('loginpassword').value;
    req.open('POST','localhost:3000/login-user',true);
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify({username: username,password: password}));
};

document.getElementById('registerButton').onclick = function(){
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
        if(req.readyState == XMLHttpRequest.DONE){
            if(req.status == 200){
                console.log("user logged in");
            }else if(req.status == 403){
                console.log("invalid data");
            }else if(req.status == 500){
                console.log("something went wrong on the server");
            }
        }
    };
    var username = document.getElementById('registerusername').value;
    var password = document.getElementById('registerpassword').value;
    var phone = document.getElementById('registerphone').value;
    req.open('POST','localhost:3000/create-user',true);
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify({username: username,password: password,phone: phone}));
};