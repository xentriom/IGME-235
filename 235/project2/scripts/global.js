window.accountName;
let mode = "normal";
let currentID;
let pokeColor;

// When the user clicks the home button, display the initial pokemon list
const homeButton = document.getElementById('home');
homeButton.addEventListener('click', function () {
    clearResults();
    disableButtons();
    getPokemonData(displayLimit, 0, false);
});

// When the user clicks the about button, redirect to the about page
const aboutButton = document.getElementById('about');
aboutButton.addEventListener('click', function () {
    window.location.href = 'about.html';
});

const searchButton = document.querySelector("#search");
searchButton.addEventListener("click", function () {
    clearResults();
    handleSearch();
});

const searchInput = document.querySelector("#searchterm");
searchInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        handleSearch();
    }
});

// When the user clicks the randomizer button, display random pokemon or infographic
const randomizerButton = document.getElementById('randomizer');
randomizerButton.addEventListener('click', function () {
    if (mode === "infographic") {
        clearResults();
        disableButtons();
        getPokemon(Math.floor(Math.random() * (1017 - 1 + 1)) + 1)
        return;
    }

    clearResults();
    disableButtons();
    getPokemonData(displayLimit, 0, true);
});

const previousButton = document.getElementById('previous-button');
previousButton.addEventListener('click', () => {
    disableButtons();
    clearResults();

    // If the user is in normal mode, display the previous page of pokemon
    // If the user is in random mode, display a random page of pokemon
    // If the user is in infographic mode, display the previous pokemon
    if (mode === "normal") {
        if (offset > 0) {
            offset -= displayLimit;
            getPokemonData(displayLimit, offset, false);
        }
        else {
            offset = 1017 - displayLimit;
            getPokemonData(displayLimit, offset, false);
        }
    }
    else if (mode === "random") {
        getPokemonData(displayLimit, 0, true);
    }
    else if (mode === "infographic") {
        if (currentID === 1) {
            currentID = 1018;
            getPokemon(currentID - 1);
        }
        else {
            getPokemon(currentID - 1);
        }
    }
});

const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    disableButtons();
    clearResults();

    // If the user is in normal mode, display the next page of pokemon
    // If the user is in random mode, display a random page of pokemon
    // If the user is in infographic mode, display the next pokemon
    if (mode === "normal") {
        console.log(offset);
        if (offset < 1017 - displayLimit) {
            offset += displayLimit;
            getPokemonData(displayLimit, offset, false);
        }
        else{
            offset = 0;
            getPokemonData(displayLimit, offset, false);
        }
    }
    else if (mode === "random") {
        getPokemonData(displayLimit, 0, true);
    }
    else if (mode === "infographic") {
        if (currentID === 1017) {
            currentID = 0;
            getPokemon(currentID + 1);
        } else {
            getPokemon(currentID + 1);
        }
    }
});

const storageButton = document.querySelector("#favorite");
storageButton.addEventListener("click", function () {
    loadSavedPokemon();
});