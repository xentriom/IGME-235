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

function formatString(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

async function getPokemon(pokemon) {
    try {
        const pokeSpecies_response = await fetch(`${pokeSpecies_URL}${pokemon}`);
        if (pokeSpecies_response.ok) {
            const pokeSpecies_data = await pokeSpecies_response.json();
            dexNumber = pokeSpecies_data.id;

            const poke_response = await fetch(`${poke_URL}${dexNumber}`);
            if (poke_response.ok) {
                const poke_data = await poke_response.json();
                clearResults();
                const pokemonInfo = getPokemonInfo(poke_data);
                const speciesInfo = getSpeciesInfo(pokeSpecies_data);
                createInfographic(pokemonInfo, speciesInfo);

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

function clearResults() {
    const results = document.getElementById("results");

    if (results) {
        const existingCanvas = results.querySelector("canvas");
        if (existingCanvas) {
            existingCanvas.remove();
        }
    }

    results.innerHTML = "";
}

function getPokemonInfo(data) {
    const pokemonMap = new Map([
        ['Name', formatString(data.name)],
        ['Id', data.id],
        ['Type', data.types.map((type) => formatString(type.type.name))],
        ['Ability', data.abilities
            .filter((ability) => !ability.is_hidden)
            .map((ability) => formatString(ability.ability.name))],
        ['HiddenAbility', data.abilities
            .filter((ability) => ability.is_hidden)
            .map((ability) => formatString(ability.ability.name))],
        ['Weight', data.weight],
        ['Height', data.height],
        ['Stats', data.stats],
        ['MaleDefaultImage', data.sprites.front_default],
        ['FemaleDefaultImage', data.sprites.front_female],
        ['MaleDefaultShinyImage', data.sprites.front_shiny],
        ['FemaleShinyImage', data.sprites.front_shiny_female],
        ['DefaultArtwork', data.sprites.other['official-artwork'].front_default],
        ['ShinyArtwork', data.sprites.other['official-artwork'].front_shiny]
    ]);

    return pokemonMap;
}

function getSpeciesInfo(data) {
    const pokemonMap = new Map([
        ['Color', formatString(data.color.name)],
        ['EggGroup', data.egg_groups.map((group) => formatString(group.name))]
    ]);

    return pokemonMap;
}

function createInfographic(pokeMap, speciesMap) {
    const results = document.getElementById("results");
    const infoMap = new Map([...pokeMap, ...speciesMap]);

    results.classList.remove('showcase');
    results.classList.add('infographic');

    const infoSectionDiv = document.createElement('div');
    infoSectionDiv.classList.add('infoSection');

    const titleSectionDiv = document.createElement('div');
    titleSectionDiv.classList.add('titleSection');

    const aboutSectionDiv = document.createElement('div');
    aboutSectionDiv.classList.add('aboutSection');

    const battleSectionDiv = document.createElement('div');
    battleSectionDiv.classList.add('battleSection');

    const graphicsSectionDiv = document.createElement('div');
    graphicsSectionDiv.classList.add('graphicsSection');

    const elementTypes = [
        { type: "h1", key: "Name", div: "titleSection" },
        { type: "p", key: "Id", prefix: "ID: ", div: "aboutSection" },
        { type: "p", key: "Ability", prefix: "Ability: ", div: "aboutSection" },
        { type: "p", key: "HiddenAbility", prefix: "Hidden Ability: ", div: "aboutSection" },
        { type: "p", key: "Weight", prefix: "Weight: ", div: "aboutSection" },
        { type: "p", key: "Height", prefix: "Height: ", div: "aboutSection" },
        { type: "p", key: "EggGroup", prefix: "Egg Group: ", div: "aboutSection" },
        { type: "p", key: "Color", prefix: "Color: ", div: "aboutSection" },
        { type: "p", key: "Type", div: "aboutSection" },
        { type: "img", key: "DefaultArtwork", div: "graphicsSection" },
        { type: "button", key: "Favorite", div: "graphicsSection" }
    ];

    elementTypes.forEach(({ type, key, prefix = "", div }) => {
        let targetDiv;
        if (div === "titleSection") {
            targetDiv = titleSectionDiv;
        } else if (div === "aboutSection") {
            targetDiv = aboutSectionDiv;
        } else if (div === "battleSection") {
            targetDiv = battleSectionDiv;
        } else if (div === "infoSection") {
            targetDiv = infoSectionDiv;
        } else {
            targetDiv = graphicsSectionDiv;
        }

        if (type === "img") {
            const element = document.createElement(type);
            element.src = infoMap.get(key);
            targetDiv.appendChild(element);
        } else if (type === "button") {
            const element = document.createElement(type);
            element.id = "save";
            element.textContent = "Favorite";
            element.addEventListener("click", function () {
                savePokemon(infoMap.get("Id"));
            });
            targetDiv.appendChild(element);
        } else if (type === "p" && key === "Type") {
            const types = infoMap.get(key);
            if (types.length >= 1) {
                const element1 = document.createElement(type);
                element1.textContent = `${types[0]}`;
                targetDiv.appendChild(element1);
            }
            if (types.length >= 2) {
                const element2 = document.createElement(type);
                element2.textContent = `${types[1]}`;
                targetDiv.appendChild(element2);
            }
        } else {
            const element = document.createElement(type);
            element.textContent = `${prefix}${infoMap.get(key)}`;
            targetDiv.appendChild(element);
        }
    });

    results.appendChild(infoSectionDiv);
    results.appendChild(graphicsSectionDiv);

    infoSectionDiv.appendChild(titleSectionDiv);
    infoSectionDiv.appendChild(aboutSectionDiv);
    // infoSectionDiv.appendChild(battleSectionDiv);

    createStatGraph(infoMap.get("Stats"));
    ApplyStyles(infoMap);
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
    const infoSectionDiv = document.querySelector('.infoSection');

    let div = document.createElement("div");
    div.classList.add("stats");
    let canvas = document.createElement("canvas");
    canvas.id = "statChart";
    infoSectionDiv.appendChild(div);
    div.appendChild(canvas);

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

function ApplyStyles(infoMap) {
    const results = document.getElementById("results");
    const infoSectionDiv = document.querySelector('.infoSection');
    const titleSectionDiv = document.querySelector('.titleSection');
    const aboutSectionDiv = document.querySelector('.aboutSection');
    const battleSectionDiv = document.querySelector('.battleSection');
    const graphicsSectionDiv = document.querySelector('.graphicsSection');
}