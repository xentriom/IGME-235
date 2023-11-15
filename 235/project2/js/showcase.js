const displayLimit = 20;
let selectedPokemonIds = [];
let offset = 20;

window.addEventListener('DOMContentLoaded', function () {
    getPokemonData(displayLimit, offset, false);
});

const previousButton = document.getElementById('previous-button');
previousButton.addEventListener('click', () => {
    if (offset >= 0) {
        offset -= 20;
        disableButtons();
        clearResults();
        getPokemonData(displayLimit, offset, false);
    }
});

const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    if (offset <= 1015) {
        offset += 20;
        disableButtons();
        clearResults();
        getPokemonData(displayLimit, offset, false);
    }
});

const randomizerButton = document.getElementById('randomizer');
randomizerButton.addEventListener('click', function () {
    clearResults();
    getPokemonData(displayLimit, 0, true);
});

function disableButtons() {
    previousButton.disabled = true;
    nextButton.disabled = true;
}

function enableButtons() {
    previousButton.disabled = false;
    nextButton.disabled = false;
}

function clearResults() {
    const resultsElement = document.getElementById('results');
    const canvas = resultsElement.querySelector('canvas');

    if (canvas) {
        canvas.remove();
    }

    resultsElement.innerHTML = '';
}

function getPokemonData(limit, offset, random) {
    const getRandomPokemonId = () => Math.floor(Math.random() * 1015) + 1;

    if (random) {
        for (let i = 0; i < limit; i++) {
            let randomPokemonId = getRandomPokemonId();

            while (selectedPokemonIds.includes(randomPokemonId)) {
                randomPokemonId = getRandomPokemonId();
            }

            selectedPokemonIds.push(randomPokemonId);

            fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`);
        }
        selectedPokemonIds = [];
    } else {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const pokemonList = data.results;
                pokemonList.forEach(pokemon => {
                    fetchPokemonData(pokemon.url);
                });
            })
            .catch(error => {
                console.log(`An error occurred while fetching Pokémon list\nError: ${error}`);
            });
    }

    enableButtons();
}

function fetchPokemonData(pokemonUrl) {
    fetch(pokemonUrl)
        .then(response => response.json())
        .then(pokemonData => { createShowcase(pokemonData); })
        .catch(error => {
            console.log(`An error occurred while fetching Pokémon data\nError: ${error}`);
        });
}

function createShowcase(pokemonData) {
    const pokemonName = pokemonData.name;
    const pokemonSprite = pokemonData.sprites.front_default;
    const pokemonId = pokemonData.id;
    const resultsElement = document.getElementById('results');

    const pokemonDiv = document.createElement('div');
    pokemonDiv.id = `pokemon${pokemonId}`;

    const nameElement = document.createElement('h2');
    nameElement.textContent = pokemonName;

    const spriteElement = document.createElement('img');
    spriteElement.src = pokemonSprite;
    spriteElement.alt = pokemonName;
    spriteElement.classList.add('cursorChange');

    spriteElement.addEventListener('click', function () {
        resultsElement.innerHTML = '';
        getPokemon(pokemonName);
    });

    pokemonDiv.appendChild(nameElement);
    pokemonDiv.appendChild(spriteElement);

    resultsElement.appendChild(pokemonDiv);
    resultsElement.classList.add('showcase');
}