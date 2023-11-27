const displayLimit = 32;
let offset = 0;
let selectedPokemonIds = [];

// Display the initial pokemon list when the page loads
window.addEventListener('DOMContentLoaded', function () {
    getPokemonData(displayLimit, 0, false);
});

// Helper function to disable the previous and next buttons
function disableButtons() {
    previousButton.disabled = true;
    previousButton.style.display = 'none';
    nextButton.disabled = true;
    nextButton.style.display = 'none';
}

// Helper function to enable the previous and next buttons
function enableButtons() {
    previousButton.disabled = false;
    previousButton.style.display = 'block';
    nextButton.disabled = false;
    nextButton.style.display = 'block';
}

// Helper function to clear the results div
function clearResults() {
    const resultsElement = document.getElementById('results');
    const canvas = resultsElement.querySelector('canvas');

    if (canvas) {
        canvas.remove();
    }

    resultsElement.innerHTML = '';
}

// Fetch the pokemon data from the API depending on the mode
function getPokemonData(limit, offset, random) {
    const getRandomPokemonId = () => Math.floor(Math.random() * 1015) + 1;

    if (random) {
        mode = 'random';
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
        mode = 'normal';
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

// Fetch the data using the url provided and call the createShowcase function
function fetchPokemonData(pokemonUrl) {
    fetch(pokemonUrl)
        .then(response => response.json())
        .then(pokemonData => {
            createShowcase(pokemonData);
        })
        .catch(error => {
            console.log(`An error occurred while fetching Pokémon data\nError: ${error}`);
        });
}

// Create the showcase for the pokemon
function createShowcase(pokemonData) {
    const pokemonName = pokemonData.name;
    const pokemonSprite = pokemonData.sprites.front_default;
    const pokemonId = pokemonData.id;
    const resultsElement = document.getElementById('results');

    const pokemonDiv = document.createElement('div');
    pokemonDiv.id = `pokemon${pokemonId}`;
    pokemonDiv.classList.add('pokemon');
    pokemonDiv.classList.add('cursorChange');

    const nameElement = document.createElement('h2');
    nameElement.textContent = formatString(pokemonName);

    const spriteElement = document.createElement('img');
    spriteElement.src = pokemonSprite;
    spriteElement.alt = pokemonName;

    pokemonDiv.addEventListener('click', function () {
        resultsElement.innerHTML = '';
        getPokemon(pokemonName);
    });

    pokemonDiv.appendChild(nameElement);
    pokemonDiv.appendChild(spriteElement);

    resultsElement.appendChild(pokemonDiv);
    resultsElement.classList.remove('infographic');
    resultsElement.classList.add('showcase');
}