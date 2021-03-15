 async function getData() {
   document.getElementById("databox").innerHTML = "";
   document.getElementById("progBar").style.width = "0%";
   await sleep(2000);
   document.getElementById("progBar").style.width = "25%";

   fetch("/recieve", {
       method: "GET"
     })
     .then(function(response) {
       document.getElementById("progBar").style.width = "50%";
       return response.json();
     })
     .then(function(data) {
       document.getElementById("progBar").style.width = "75%";
       console.log(data);
       var formattedString = data.split(",").join("<br>").split("Data changes every hour!").join("<br> <br>");

       document.getElementById("databox").innerHTML = formattedString;
       document.getElementById("progBar").style.width = "100%";
     });

 }

 function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
 }