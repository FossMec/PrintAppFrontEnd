
var req = new XMLHttpRequest();

req.open('GET', '/fetch-user-data', true);
req.setRequestHeader('Content-Type', 'application/json');
req.onreadystatechange = function () {
    if (req.readyState == XMLHttpRequest.DONE) {
        if (req.status == 200) {
            data = JSON.parse(this.responseText);
            console.log(data);
            if(data.credits == 0){
                document.getElementById('upload-button').classList.add("disabled");
            }
            document.getElementById('credit-value').innerHTML = data.credits;
            for(var i=0;i<data.history.length;++i){
                var ul = document.getElementById("history-tags");
                var li = document.createElement("li");
                var img = document.createElement("img");
                img.setAttribute("src", "/public/assets/pdf1.jpg");
                img.setAttribute("id", "pdf");
                var span = document.createElement("span");
                span.innerHTML=data.history[i];
                span.setAttribute("id", "history");
                li.appendChild(img);
                li.appendChild(span);
                ul.appendChild(li);
            }
        }else if (req.status == 500) {
            alert('We are having trouble with the server');
        }
    }
};
req.send();



