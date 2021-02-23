function changePage(page){
    if(page.match("LINE")){
        document.getElementById("Home").style.display = "none";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("Windy").style.display = "none";
        document.getElementById(page).style.display = "block";
    }
    else if(page.match("Fire Timeline")){
        document.getElementById("LINE").style.display = "none";
        document.getElementById("Home").style.display = "none";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("Windy").style.display = "none";
        document.getElementById(page).style.display = "block";
    }
    else if(page.match("Nasa FIRMS")){
         document.getElementById("Home").style.display = "none";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("LINE").style.display = "none";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("Windy").style.display = "none";
        document.getElementById(page).style.display = "block";
    }
    else if(page.match("CuSense")){
        document.getElementById("Home").style.display = "none";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("LINE").style.display = "none";
        document.getElementById("Windy").style.display = "none";
        document.getElementById(page).style.display = "block";
    }
    else if(page.match("Windy")){
         document.getElementById("Home").style.display = "none";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("LINE").style.display = "none";
        document.getElementById(page).style.display = "block";
    }
    else{
         document.getElementById("LINE").style.display = "none";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("Windy").style.display = "none";
        document.getElementById("Home").style.display = "block";
    }
}