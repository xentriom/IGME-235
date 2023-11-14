document.querySelector("#search").onclick = searchButtonClicked;
document.addEventListener('DOMContentLoaded', searchButtonClicked);

let statGraph = null;

function searchButtonClicked() {
    const pokeURL = "https://pokeapi.co/api/v2/pokemon/";
    let url = pokeURL;

    let term = encodeURIComponent(document.querySelector("#searchterm").value.trim().toLowerCase());

    if (term.length < 1) return;
    url += term;

    console.log(url);
    getData(url);
}

function getData(url) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function (e) {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            pokeBasicInfo(response);
            pokeStatGraph(response);
            pokeAbilities(response);
            pokeSpeciesInfo(response.name);
        } else {
            console.log("An error occurred");
        }
    };

    xhr.onerror = function () {
        console.log("An error occurred");
    };

    xhr.open("GET", url);
    xhr.send();
}

function pokeBasicInfo(response) {
    let pokeName = document.querySelector("#pokeName");
    pokeName.innerHTML = response.name;

    let pokeType = document.querySelector("#pokeType");
    pokeType.innerHTML = `Type: ${response.types
        .map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1))
        .join(", ")}`;

    let pokePic = document.querySelector("#pokePic");
    pokePic.src = response.sprites.front_default;

    let pokeShiny = document.querySelector("#pokeShiny");
    pokeShiny.src = response.sprites.front_shiny;

    let pokeWeight = document.querySelector("#pokeWeight");
    pokeWeight.innerHTML = `Weight: ${response.weight} lbs`;

    let pokeHeight = document.querySelector("#pokeHeight");
    pokeHeight.innerHTML = `Height: ${response.height} ft`;
}

function pokeStatGraph(response) {
    const statNameMap = {
        "hp": "HP",
        "attack": "Atk",
        "defense": "Def",
        "special-attack": "SpA",
        "special-defense": "SpD",
        "speed": "Spe"
    };

    let statName = response.stats.map(stat => statNameMap[stat.stat.name]);
    let statValue = response.stats.map(stat => stat.base_stat);
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
}

function tempStats(response) {
    let pokeStats = document.querySelector("#pokeStats");
    pokeStats.innerHTML = "Base Stats:<br>";
    response.stats.forEach(stat => {
        pokeStats.innerHTML += `${stat.stat.name}: ${stat.base_stat}<br>`;
    });
}

function pokeAbilities(response) {
    let pokeAbilities = document.querySelector("#pokeAbilities");
    pokeAbilities.innerHTML = `Abilities: ${response.abilities
        .filter(ability => !ability.is_hidden)
        .map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1))
        .join(", ")}`;

    let hidden = document.querySelector("#pokeHiddenAb");
    let hiddenAbilities = response.abilities.filter(ability => ability.is_hidden);
    if (hiddenAbilities.length > 0) {
        hidden.innerHTML = `Hidden: ${hiddenAbilities
            .map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1))
            .join(", ")}`;
    } else {
        hidden.innerHTML = "";
    }
}

function pokeSpeciesInfo(pokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`;
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const color = response.color.name.charAt(0).toUpperCase() + response.color.name.slice(1);

            const eggGroup = response.egg_groups
                .map(group => group.name.charAt(0).toUpperCase() + group.name.slice(1))
                .join(", ");

            let pokeColor = document.querySelector("#pokeColor");
            pokeColor.innerHTML = `Color: ${color}`;

            let pokeEgg = document.querySelector("#pokeEgg");
            pokeEgg.innerHTML = `Egg Group: ${eggGroup}`;

            pokeEvoChain(response.evolution_chain.url);
        } else {
            console.log("Error fetching Pokémon species information.");
        }
    };

    xhr.onerror = function () {
        console.log("An error occurred while fetching Pokémon species information.");
    };

    xhr.open("GET", url);
    xhr.send();
}

function pokeEvoChain(url) {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const chain = response.chain;

            if (chain.evolves_to.length > 0) {
                const previousEvolution = chain.species.name;
                const nextEvolution = chain.evolves_to[0].species.name;

                let pokeEvolution = document.querySelector("#pokeEvolution");
                pokeEvolution.innerHTML = `Previous Evolution: ${previousEvolution}<br>Next Evolution: ${nextEvolution}`;
            } else {
                pokeEvolution.innerHTML = "";
            }
        } else {
            console.log("Error fetching evolution chain.");
        }
    };

    xhr.onerror = function () {
        console.log("An error occurred while fetching evolution chain.");
    };

    xhr.open("GET", url);
    xhr.send();
}