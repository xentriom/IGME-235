const selectedPokemonIds = [];
const displayLimit = 20;

window.addEventListener('DOMContentLoaded', function () {
    displayPokemon(displayLimit);
});

const randomizerButton = document.getElementById('randomizer');
randomizerButton.addEventListener('click', function () {
    const resultsElement = document.getElementById('results');
    const canvas = resultsElement.querySelector('canvas');

    if (canvas) {
        canvas.remove();
    }

    resultsElement.innerHTML = '';
    displayRandomPokemon(displayLimit);
});

function displayPokemon(limit) {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`)
        .then(response => response.json())
        .then(data => {
            const pokemonList = data.results;
            pokemonList.forEach(pokemon => {
                fetch(pokemon.url)
                    .then(response => response.json())
                    .then(pokemonData => { logPokemonData(pokemonData); })
                    .catch(error => {
                        console.log(`An error occurred while fetching Pokémon data\nError: ${error}`);
                    });
            });
        })
        .catch(error => {
            console.log(`An error occurred while fetching Pokémon list\nError: ${error}`);
        });
}

function displayRandomPokemon(limit) {
    const getRandomPokemonId = () => Math.floor(Math.random() * 1015) + 1;

    for (let i = 0; i < limit; i++) {
        let randomPokemonId = getRandomPokemonId();

        while (selectedPokemonIds.includes(randomPokemonId)) {
            randomPokemonId = getRandomPokemonId();
        }

        selectedPokemonIds.push(randomPokemonId);

        fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`)
            .then(response => response.json())
            .then(pokemonData => { logPokemonData(pokemonData); })
            .catch(error => {
                console.log(`An error occurred while fetching Pokémon data: ${error}`);
            });
    }
}

function logPokemonData(pokemonData) {
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

    spriteElement.addEventListener('click', function() {
        resultsElement.innerHTML = '';
        getPokemon(pokemonName);
    });

    pokemonDiv.appendChild(nameElement);
    pokemonDiv.appendChild(spriteElement);

    resultsElement.appendChild(pokemonDiv);
    resultsElement.classList.add('showcase');
}