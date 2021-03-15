 async function getData() {
   var dataString = "";
   fetch("/recieve", {
       method: "GET"
     })
     .then(function(response) {
       return response.json();
     })
     .then(function(data) {
       dataString = data;
     });
   document.getElementById("databox").value = dataString;
 }