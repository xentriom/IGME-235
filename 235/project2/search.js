const poke_URL = "https://pokeapi.co/api/v2/pokemon/";
const pokeSpecies_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let statGraph = null;
let dexNumber;
let pokeColor;

const searchButton = document.querySelector("#search");
searchButton.addEventListener("click", function () {
    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = "";
    handleSearch();
});

const searchInput = document.querySelector("#searchterm");
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

function handleSearch() {
    const searchInput = document.querySelector("#searchterm");
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== "") {
        const pokemon = searchTerm.toLowerCase();
        getPokemon(pokemon);
    }
}

async function getPokemon(pokemon) {
    try {
        const pokeSpecies_response = await fetch(`${pokeSpecies_URL}${pokemon}`);
        if (pokeSpecies_response.ok) {
            const pokeSpecies_data = await pokeSpecies_response.json();
            dexNumber = pokeSpecies_data.id;
            displayPokemonSpecies(pokeSpecies_data)

            const poke_response = await fetch(`${poke_URL}${dexNumber}`);
            if (poke_response.ok) {
                const poke_data = await poke_response.json();
                displayPokemon(poke_data);
            } else {
                console.log(`An error occurred trying to fetch data from ${poke_URL}`);
            }
        } else {
            console.log(`An error occurred trying to fetch data from ${pokeSpecies_URL}`);
        }
    } catch (error) {
        console.log(`An error occurred during getPokemon()\nError: ${error}`);
    }
}

function formatString(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

function displayPokemon(data) {
    const results = document.getElementById("results");
    const pokemonMap = new Map([
        ['Name', formatString(data.name)],
        ['Type', data.types.map((type) => formatString(type.type.name))],
        ['Ability', data.abilities
            .filter((ability) => !ability.is_hidden)
            .map((ability) => formatString(ability.ability.name))],
        ['HiddenAbility', data.abilities
            .filter((ability) => ability.is_hidden)
            .map((ability) => formatString(ability.ability.name))],
        ['Weight', data.weight],
        ['Height', data.height],
        ['MaleDefaultImage', data.sprites.front_default],
        ['FemaleDefaultImage', data.sprites.front_female],
        ['MaleDefaultShinyImage', data.sprites.front_shiny],
        ['FemaleShinyImage', data.sprites.front_shiny_female],
        ['DefaultArtwork', data.sprites.other['official-artwork'].front_default],
        ['ShinyArtwork', data.sprites.other['official-artwork'].front_shiny]
    ]);

    createElements(pokemonMap);
    createStatGraph(data.stats);
}

function displayPokemonSpecies(data) {
    const pokemonMap = new Map([
        ['Color', formatString(data.color.name)],
        ['EggGroup', data.egg_groups.map((group) => formatString(group.name))]
    ]);
}

function createStatGraph(statsData) {
    const statNameMap = {
        "hp": "HP",
        "attack": "Atk",
        "defense": "Def",
        "special-attack": "SpA",
        "special-defense": "SpD",
        "speed": "Spe"
    };

    if (statGraph) {
        statGraph.destroy();
    }

    let labels = statsData.map(stat => statNameMap[stat.stat.name]);
    let values = statsData.map(stat => stat.base_stat);
    const results = document.getElementById("results");

    let canvas = document.createElement("canvas");
    canvas.id = "statChart";
    results.appendChild(canvas);

    let ctx = canvas.getContext("2d");
    statGraph = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Base Stats',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createElements(pokemonMap) {
    const results = document.getElementById("results");

    if (results) {
        const existingCanvas = results.querySelector("canvas");
        if (existingCanvas) {
            existingCanvas.remove();
        }
    }

    results.classList.remove('showcase');
    results.classList.add('infographic');

    let name = document.createElement("h1");
    let image = document.createElement("img");
    let type = document.createElement("p");
    let ability = document.createElement("p");
    let hiddenAbility = document.createElement("p");
    let weight = document.createElement("p");
    let height = document.createElement("p");

    name.textContent = pokemonMap.get("Name");
    image.src = pokemonMap.get("DefaultArtwork");
    type.textContent = `Type: ${pokemonMap.get("Type")}`;
    ability.textContent = `Ability: ${pokemonMap.get("Ability")}`;
    hiddenAbility.textContent = `Hidden Ability: ${pokemonMap.get("HiddenAbility")}`;
    weight.textContent = `Weight: ${pokemonMap.get("Weight")}`;
    height.textContent = `Height: ${pokemonMap.get("Height")}`;

    results.appendChild(name);
    results.appendChild(image);
    results.appendChild(type);
    results.appendChild(ability);
    results.appendChild(hiddenAbility);
    results.appendChild(weight);
    results.appendChild(height);
}