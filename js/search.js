// Variable Declaration
var teamsArray = [];
var teamsNames = [];

class Team {
    constructor(id, name, crestUrl) {
        this.id = id;
        this.name = name;
        this.crestUrl = crestUrl;
    }
}

$("#searchform").submit(function(e) {
    e.preventDefault();
});

fetchData();
autocomplete(document.getElementById("myInput"), teamsNames);

function fetchData() {

    let urls = ["https://api.football-data.org/v2/competitions/PD/teams", "https://api.football-data.org/v2/competitions/PL/teams"];
    for (let i = 0; i < urls.length; i++) {

        fetch(urls[i], {
                method: "GET",
                headers: {
                    "X-Auth-Token": "d38ac557ec364cf79e21a985e5d1cf8c",
                }
            })
            .then(resp => {
                return resp.json();
            })
            .then(function(data) {
                var teamdata = data.teams;
                for (let i = 0; i < teamdata.length; i++) {
                    var team = new Team(teamdata[i].id, teamdata[i].name, teamdata[i].crestUrl);
                    teamsArray.push(team);
                    teamsNames.push(team.name);
                }
            })
            .catch(function(error) {
                console.log(error);
            });
    }
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

function searchValidation() {
    var fn = document.getElementById('myInput').value;
    if (fn == "") {
        alert('Please Enter Team Name');
        document.getElementById('myInput').style.borderColor = "red";
        return false;

    } else if (/^[0-9]+$/.test(document.getElementById("myInput").value)) {
        alert("Team Name Contains Numbers!");
        document.getElementById('myInput').style.borderColor = "red";
        return false;

    } else if (fn.length <= 2) {
        alert('Team Name is To Short');
        document.getElementById('myInput').style.borderColor = "red";
        return false;

    } else {
        document.getElementById('myInput').style.borderColor = "green";
    }

    var inputValue = document.getElementById('myInput').value;
    if (teamsNames.includes(inputValue)) {
        getTeamInfo(inputValue);
        document.getElementById('searchform').reset();
    } else {
        alert("Please write a team valid name..!")
    }
};

function getTeamInfo(teamName) {
    var team = teamsArray.find(element => element.name === teamName);
    console.log(teamName);
    var modal = document.getElementById("headerModal");
    var modalImg = document.getElementById("headermodalImage");

    modal.style.display = "block";
    modalImg.src = team.crestUrl;

    modal.onclick = function() {
        modal.style.display = "none";
    }
}