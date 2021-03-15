 async function getData() {
   var dataString = "";
   fetch("/recieve", {
       method: "GET"
     })
     .then(function(response) {
       return response.json();
     })
     .then(function(data) {
       console.log(data);
       var node = document.createTextNode(data);
       document.getElementById("databox").appendChild(node);
     });

 }