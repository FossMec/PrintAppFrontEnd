document.getElementById('registerButton').onclick = function(){
    var req = new XMLHttpRequest();
    
    var username = document.getElementById('registerusername').value;
    var password = document.getElementById('registerpassword').value;
    var phone = document.getElementById('registerphone').value;
    console.log(username,password);
    req.open('POST','/create-user',true);
    req.setRequestHeader('Content-Type','application/json');
    req.onreadystatechange = function(){
        console.log(req.readyState);
        if(req.readyState == XMLHttpRequest.DONE){
            if(req.status == 200){
                window.location.href = '/login.html';
            }else if(req.status == 403){
                alert("invalid data");
            }else if(req.status == 500){
                alert("something went wrong on the server");
            }
        }
    };
    req.send(JSON.stringify({username: username,password: password,phone: phone}));
    return false;
};