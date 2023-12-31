const poke_URL = "https://pokeapi.co/api/v2/pokemon/";
const pokeSpecies_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let statGraph = null;
let dexNumber;

function handleSearch() {
    const searchInput = document.querySelector("#searchterm");
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== "") {
        const pokemon = searchTerm.toLowerCase();
        getPokemon(pokemon);
    }
}

// Helper function to format the pokemon name
function formatString(str) {
    return str.replace(/-/g, ' ').replace(/\b\w/g, (match) => match.toUpperCase());
}

// Create two fetch requests to get the pokemon and species data, then create the infographic
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
            alert(`An error occurred trying to retrive "${pokemon}".\nPlease check your spelling/id and try again.\n\nNOTE: Pokemon with multiple forms like Aegislash are not supported.`);
            clearResults();
            disableButtons();
            getPokemonData(displayLimit, 0, false);
        }
    } catch (error) {
        console.log(`An error occurred during getPokemon()\nError: ${error}`);
    }
}

// Helper function to clear the results div
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

// Helper function to get all revelant pokemon data
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

// Helper function to get all revelant species data
function getSpeciesInfo(data) {
    const pokemonMap = new Map([
        ['Color', formatString(data.color.name)],
        ['EggGroup', data.egg_groups.map((group) => formatString(group.name))]
    ]);

    return pokemonMap;
}

// Create the infographic by combining the pokemon and species data and adding it to the results div
function createInfographic(pokeMap, speciesMap) {
    mode = 'infographic';
    currentID = pokeMap.get("Id");

    changeFocus(pokeMap.get("Name"));

    const results = document.getElementById("results");
    const infoMap = new Map([...pokeMap, ...speciesMap]);

    results.classList.remove('showcase');
    results.classList.add('infographic');

    // Create sections for the infographic
    const infoSectionDiv = createDivWithClass('infoSection');
    const titleSectionDiv = createDivWithClass('titleSection');
    const aboutSectionDiv = createDivWithClass('aboutSection');
    const graphicsSectionDiv = createDivWithClass('graphicsSection');
    const dexSectionDiv = createDivWithClass('dexSection');
    const typeSectionDiv = createDivWithClass('typeSection');
    const descriptionSectionDiv = createDivWithClass('descriptionSection');
    const abilitySectionDiv = createDivWithClass('abilitySection');
    const hiddenSectionDiv = createDivWithClass('hiddenSection');
    const massSectionDiv = createDivWithClass('massSection');
    const eggSectionDiv = createDivWithClass('eggSection');

    // Create elements for the infographic
    const elementTypes = [
        { type: "h1", key: "Name", div: "titleSection" },
        { type: "p", key: "Id", prefix: "Dex #", div: "dexSection" },
        { type: "p", key: "Ability", prefix: "Ability: ", div: "abilitySection" },
        { type: "p", key: "HiddenAbility", prefix: "Hidden Ability: ", div: "hiddenSection" },
        { type: "p", key: "Weight", prefix: "Weight: ", div: "massSection" },
        { type: "p", key: "Height", prefix: "Height: ", div: "massSection" },
        { type: "p", key: "EggGroup", prefix: "Egg Group: ", div: "eggSection" },
        { type: "p", key: "Type", div: "typeSection" },
        { type: "img", key: "DefaultArtwork", div: "graphicsSection" },
        { type: "button", key: "Favorite", div: "graphicsSection" }
    ];

    // Set the target div for each element
    elementTypes.forEach(({ type, key, prefix = "", div }) => {
        let targetDiv;
        switch (div) {
            case "titleSection":
                targetDiv = titleSectionDiv;
                break;
            case "aboutSection":
                targetDiv = aboutSectionDiv;
                break;
            case "infoSection":
                targetDiv = infoSectionDiv;
                break;
            case "dexSection":
                targetDiv = dexSectionDiv;
                break;
            case "descriptionSection":
                targetDiv = descriptionSectionDiv;
                break;
            case "abilitySection":
                targetDiv = abilitySectionDiv;
                break;
            case "hiddenSection":
                targetDiv = hiddenSectionDiv;
                break;
            case "massSection":
                targetDiv = massSectionDiv;
                break;
            case "eggSection":
                targetDiv = eggSectionDiv;
                break;
            case "typeSection":
                targetDiv = typeSectionDiv;
                break;
            default:
                targetDiv = graphicsSectionDiv;
        }

        // Create the element and add it to the target div
        if (type === "img") {
            const element = document.createElement(type);
            element.src = infoMap.get(key);
            targetDiv.appendChild(element);
        } else if (type === "button") {
            if (window.accountName === undefined) {
                const element = document.createElement("p");
                element.textContent = "*You must be logged in to save a Pokemon!";
                element.style.color = "blue";
                targetDiv.appendChild(element);
            }
            else if (!AlreadySaved(infoMap.get("Id"))) {
                createButton(targetDiv, "save", infoMap.get("Id"));
            }
            else if (AlreadySaved(infoMap.get("Id"))) {
                createButton(targetDiv, "unsave", infoMap.get("Id"));
            }
        } else if (type === "p" && key === "Type") {
            const types = infoMap.get(key);
            if (types.length >= 1) {
                const element = document.createElement(type);
                element.textContent = `${types[0]}`;
                targetDiv.appendChild(element);
            }
            if (types.length >= 2) {
                const element = document.createElement(type);
                element.textContent = `${types[1]}`;
                targetDiv.appendChild(element);
            }
        } else if (key === "EggGroup") {
            const title = document.createElement("h3");
            title.textContent = "Egg Group";
            targetDiv.appendChild(title);

            const eggG = infoMap.get(key);
            if (eggG.length >= 1) {
                const subject = document.createElement(type);
                subject.textContent = `${eggG[0]}`;
                if (eggG[0] === "No Eggs") {
                    subject.textContent = "None";
                }
                subject.classList.add("bubble");
                targetDiv.appendChild(subject);
            }
            if (eggG.length >= 2) {
                const subject = document.createElement(type);
                subject.textContent = `${eggG[1]}`;
                subject.classList.add("bubble");
                targetDiv.appendChild(subject);
            }
        }
        else if (key === "Ability") {
            const title = document.createElement("h3");
            title.textContent = "Ability";
            targetDiv.appendChild(title);

            const ability = infoMap.get(key);
            if (ability.length >= 1) {
                const subject = document.createElement(type);
                subject.textContent = `${ability[0]}`;
                subject.classList.add("bubble");
                targetDiv.appendChild(subject);
            }
            if (ability.length >= 2) {
                const subject = document.createElement(type);
                subject.textContent = `${ability[1]}`;
                subject.classList.add("bubble");
                targetDiv.appendChild(subject);
            }
        }
        else if (key === "HiddenAbility") {
            const title = document.createElement("h3");
            title.textContent = "Hidden Ability";
            targetDiv.appendChild(title);

            const ability = infoMap.get(key);
            if (ability.length === 0) {
                const subject = document.createElement(type);
                subject.textContent = "None";
                subject.classList.add("bubble");
                targetDiv.appendChild(subject);
            }
            if (ability.length >= 1) {
                const subject = document.createElement(type);
                subject.textContent = `${ability[0]}`;
                subject.classList.add("bubble");
                targetDiv.appendChild(subject);
            }
            if (ability.length >= 2) {
                const subject = document.createElement(type);
                subject.textContent = `${ability[1]}`;
                subject.classList.add("bubble");
                targetDiv.appendChild(subject);
            }
        }
        else if (key === "Weight") {
            const title = document.createElement("h3");
            title.textContent = "Mass";
            targetDiv.appendChild(title);

            const element = document.createElement(type);
            element.textContent = `${infoMap.get(key)} lbs`;
            element.classList.add("bubble");
            targetDiv.appendChild(element);
        }
        else if (key === "Height") {
            const element = document.createElement(type);
            element.textContent = `${infoMap.get(key)} ft`;
            element.classList.add("bubble");
            targetDiv.appendChild(element);
        }
        else {
            const element = document.createElement(type);
            element.textContent = `${prefix}${infoMap.get(key)}`;
            targetDiv.appendChild(element);
        }
    });

    // Append the sections to the correct divs
    results.appendChild(infoSectionDiv);
    results.appendChild(graphicsSectionDiv);

    infoSectionDiv.appendChild(titleSectionDiv);
    infoSectionDiv.appendChild(aboutSectionDiv);

    aboutSectionDiv.appendChild(dexSectionDiv);
    aboutSectionDiv.appendChild(descriptionSectionDiv);

    dexSectionDiv.appendChild(typeSectionDiv);

    descriptionSectionDiv.appendChild(abilitySectionDiv);
    descriptionSectionDiv.appendChild(hiddenSectionDiv);
    descriptionSectionDiv.appendChild(massSectionDiv);
    descriptionSectionDiv.appendChild(eggSectionDiv);

    // Create the stat graph and enable the buttons
    createStatGraph(infoMap.get("Stats"), infoMap.get("Color"));
    enableButtons();
}

function changeFocus(pokemonName) {
    const focus = document.getElementById("searchterm");
    focus.value = pokemonName;
}

// Helper function to create a div with a class
function createDivWithClass(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}

// Create stat graph using Chart.js
function createStatGraph(statsData, pokeColor) {
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
                backgroundColor: convertColorToRGBA(pokeColor, 0.2),
                borderColor: convertColorToRGBA(pokeColor, 1),
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

// Helper function to convert a hex color to rgba
function convertColorToRGBA(color, alpha) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}