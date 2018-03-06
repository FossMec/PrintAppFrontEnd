document.getElementById('addCreditsButton').onclick = function(){
    document.getElementById('successMsg').innerHTML = '';
    document.getElementById('errorMsg').innerHTML = '';
    var req = new XMLHttpRequest();
    
    var phone = document.getElementById('phone').value;
    var credits = document.getElementById('credits').value;
    req.open('POST','/add-credits',true);
    req.setRequestHeader('Content-Type','application/json');
    req.onreadystatechange = function(){
        if(req.readyState == XMLHttpRequest.DONE){
            if(req.status == 200){
                console.log('Credits Added');
                document.getElementById('successMsg').innerHTML = 'Credits Added';                
            }else if(req.status == 403){
                document.getElementById('errorMsg').innerHTML = 'Phone Invalid';
            }else if(req.status == 500){
                document.getElementById('errorMsg').innerHTML = 'We are having trouble with the server';
            }
        }
    };  
    req.send(JSON.stringify({phone: phone,credits: credits}));
    return false;
};

