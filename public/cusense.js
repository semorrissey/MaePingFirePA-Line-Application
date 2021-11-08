/**
 * Function that fetchs data from the CuSense API and adds it to the webpage
 */
async function getData() {

  //Simulates a moving progress bar
  document.getElementById("databox").innerHTML = "";
  document.getElementById("progBar").style.width = "0%";
  //uses the sleep function to show that it the bar is loading instead of filling up instantly
  await sleep(2000);
  document.getElementById("progBar").style.width = "25%";

  /**
   * Makes a fetch call to the NodeJS server which recieves the data from the CuSense API and formats it to be placed on the webpage.
   */
  fetch("/recieve", {
      method: "GET"
    })
    .then(function(response) {
      document.getElementById("progBar").style.width = "50%";
      return response.json();
    })
    .then(function(data) {
      document.getElementById("progBar").style.width = "75%";

      var formattedString = data.split(",").join("<br>").split("Data changes every hour!").join("<br> <br>");

      document.getElementById("databox").innerHTML = formattedString;
      document.getElementById("progBar").style.width = "100%";
    });

}
/**
 * Function that simulates a timeout
 * @param    {Int} ms    Integer time in milliseconds for how long the timeout is
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}