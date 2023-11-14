const poke_URL = "https://pokeapi.co/api/v2/pokemon/";
const pokeSpecies_URL = "https://pokeapi.co/api/v2/pokemon-species/";
let dexNumber;
let pokeColor;

const searchButton = document.querySelector("#search");
searchButton.addEventListener("click", handleSearch);

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
        const response = await fetch(`${pokeSpecies_URL}${pokemon}`);
        if (response.ok) {
            const data = await response.json();
            dexNumber = data.pokedex_number;
            displayPokemon(data);
        } else {
            console.log("An error occurred trying to fetch the data");
        }
    } catch (error) {
        console.log(`An error occurred during getPokemon()\nError: ${error}`);
    }
}

async function getPokemon(pokemon) {
    try {
        const pokeSpecies_response = await fetch(`${pokeSpecies_URL}${pokemon}`);
        if (pokeSpecies_response.ok) {
            const pokeSpecies_data = await pokeSpecies_response.json();
            dexNumber = pokeSpecies_data.pokedex_number;
            displayPokemonSpecies(pokeSpecies_data)

            const poke_response = await fetch(`${poke_URL}${pokemon}`);
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
        ['FemaleShinyImage', data.sprites.front_shiny_female]
    ]);
}

function displayPokemonSpecies(data) {
    const pokemonMap = new Map([
        ['Color', formatString(data.color.name)],
        ['EggGroup', data.egg_groups.map((group) => formatString(group.name))]
    ]);

    pokeColor = pokemonMap.get('Color');
}