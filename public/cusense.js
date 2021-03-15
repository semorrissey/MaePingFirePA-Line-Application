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
       var formattedString = data.split(",").join("\n");
       var node = document.createTextNode(formattedString);
       document.getElementById("databox").appendChild(node);
     });

 }