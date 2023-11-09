window.onload = (e) => { document.querySelector("#search").onclick = searchButtonClicked };
let displayTerm = "";
let statGraph = null;

function searchButtonClicked() {
    const pokeURL = "https://pokeapi.co/api/v2/pokemon/";
    let url = pokeURL;

    let term = encodeURIComponent(document.querySelector("#searchterm").value.trim());
    displayTerm = term;

    if (term.length < 1) return;
    url += term;

    getData(url);
}


// Function to get data from the API
function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

// Function to load data
function dataLoaded(e) {
    let xhr = e.target;

    let response = JSON.parse(xhr.responseText);

    showData(response);
}

// Function in case of error
function dataError(e) {
    console.log("An error occurred");
}

// Function to show data
function showData(obj) {
    let pokeName = document.querySelector("#pokeName");
    pokeName.innerHTML = obj.name;

    let pokePic = document.querySelector("#pokePic");
    pokePic.src = obj.sprites.front_default;

    let pokeAbilities = document.querySelector("#pokeAbilities");
    pokeAbilities.innerHTML = `Abilities: ${obj.abilities.filter(ability => !ability.is_hidden).map(ability => ability.ability.name).join(", ")}`;

    let hidden = document.querySelector("#pokeHiddenAb");
    let hiddenAbilities = obj.abilities.filter(ability => ability.is_hidden);
    if (hiddenAbilities.length > 0) {
        hidden.innerHTML = `Hidden: ${hiddenAbilities.map(ability => ability.ability.name).join(", ")}`;
    } else {
        hidden.innerHTML = "";
    }

    let pokeType = document.querySelector("#pokeType");
    pokeType.innerHTML = `Type: ${obj.types.map(type => type.type.name).join(", ")}`;

    let pokeStats = document.querySelector("#pokeStats");
    pokeStats.innerHTML = "Base Stats:<br>";
    obj.stats.forEach(stat => {
        pokeStats.innerHTML += `${stat.stat.name}: ${stat.base_stat}<br>`;
    });

    let statName = obj.stats.map(stat => stat.stat.name);
    let statValue = obj.stats.map(stat => stat.base_stat);

    displayStatGraph(statName, statValue);

    let pokeWeight = document.querySelector("#pokeWeight");
    pokeWeight.innerHTML = `Weight: ${obj.weight} lbs`;

    let pokeHeight = document.querySelector("#pokeHeight");
    pokeHeight.innerHTML = `Height: ${obj.height} ft`;
};

// Function to display the stat graph
function displayStatGraph(statName, statValue) {
    let ctx = document.getElementById("statChart").getContext("2d");

    if (statGraph) {
        statGraph.destroy();
    }

    statGraph = new Chart(ctx, {
        type: "bar",
        data: {
            labels: statName,
            datasets: [
                {
                    label: "Base Stats",
                    data: statValue,
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
};