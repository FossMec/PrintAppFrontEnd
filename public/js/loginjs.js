
document.getElementById('loginButton').onclick = function(){
    var req = new XMLHttpRequest();
    
    var username = document.getElementById('loginusername').value;
    var password = document.getElementById('loginpassword').value;
    console.log(username,password);
    req.open('POST','/login-user',true);
    req.setRequestHeader('Content-Type','application/json');
    req.onreadystatechange = function(){
        if(req.readyState == XMLHttpRequest.DONE){
            if(req.status == 200){
                console.log('user logged in');
                if (username == 'admin'){
                    window.location.href = '/admin.html';
                }else {
                    window.location.href = '/user.html';                   
                }
            }else if(req.status == 403){
                document.getElementById('errorMsg').innerHTML = 'Username/Password Invalid';
            }else if(req.status == 500){
                document.getElementById('errorMsg').innerHTML = 'We are having trouble with the server';
            }
        }
    };  
    req.send(JSON.stringify({username: username,password: password}));
    return false;
};

