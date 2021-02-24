function changePage(page){
    if(page.match("LINE")){
        document.getElementById("Home").style.display = "none";
        document.getElementById("Home").style.visibility = "hidden";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Fire Timeline").style.visibility = "hidden";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("Nasa FIRMS").style.visibility = "hidden";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("CuSense").style.visibility = "hidden";
        document.getElementById("Windy").style.display = "none";
        document.getElementById("Windy").style.visibility = "hidden";
        document.getElementById(page).style.display = "block";
        document.getElementById(page).style.visibility = "visible";
    }
    else if(page.match("Fire Timeline")){
        document.getElementById("LINE").style.display = "none";
        document.getElementById("LINE").style.visibility = "hidden";
        document.getElementById("Home").style.display = "none";
        document.getElementById("Home").style.visibility = "hidden";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("Nasa FIRMS").style.visibility = "hidden";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("CuSense").style.visibility = "hidden";
        document.getElementById("Windy").style.display = "none";
        document.getElementById("Windy").style.visibility = "hidden";
        document.getElementById(page).style.display = "block";
        document.getElementById(page).style.visibility = "visible";
    }
    else if(page.match("Nasa FIRMS")){
        document.getElementById("Home").style.display = "none";
        document.getElementById("Home").style.visibility = "hidden";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Fire Timeline").style.visibility = "hidden";
        document.getElementById("LINE").style.display = "none";
        document.getElementById("LINE").style.visibility = "hidden";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("CuSense").style.visibility = "hidden";
        document.getElementById("Windy").style.display = "none";
        document.getElementById("Windy").style.visibility = "hidden";
        document.getElementById(page).style.display = "block";
        document.getElementById(page).style.visibility = "visible";
    }
    else if(page.match("CuSense")){
        document.getElementById("Home").style.display = "none";
        document.getElementById("Home").style.visibility = "hidden";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Fire Timeline").style.visibility = "hidden";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("Nasa FIRMS").style.visibility = "hidden";
        document.getElementById("LINE").style.display = "none";
        document.getElementById("LINE").style.visibility = "hidden";
        document.getElementById("Windy").style.display = "none";
        document.getElementById("Windy").style.visibility = "hidden";
        document.getElementById(page).style.display = "block";
        document.getElementById(page).style.visibility = "visible";
    }
    else if(page.match("Windy")){
        document.getElementById("Home").style.display = "none";
        document.getElementById("Home").style.visibility = "hidden";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Fire Timeline").style.visibility = "hidden";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("Nasa FIRMS").style.visibility = "hidden";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("CuSense").style.visibility = "hidden";
        document.getElementById("LINE").style.display = "none";
        document.getElementById("LINE").style.visibility = "hidden";
        document.getElementById(page).style.display = "block";
        document.getElementById(page).style.visibility = "visible";
    }
    else{
        document.getElementById("LINE").style.display = "none";
        document.getElementById("LINE").style.visibility = "hidden";
        document.getElementById("Fire Timeline").style.display = "none";
        document.getElementById("Fire Timeline").style.visibility = "hidden";
        document.getElementById("Nasa FIRMS").style.display = "none";
        document.getElementById("Nasa FIRMS").style.visibility = "hidden";
        document.getElementById("CuSense").style.display = "none";
        document.getElementById("CuSense").style.visibility = "hidden";
        document.getElementById("Windy").style.display = "none";
        document.getElementById("Windy").style.visibility = "hidden";
        document.getElementById("Home").style.display = "block";
        document.getElementById("Home").style.visibility = "visible";
    }
}