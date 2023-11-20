window.accountName;
let mode = "normal";
let currentID;
let pokeColor;

const homeButton = document.getElementById('home');
homeButton.addEventListener('click', function () {
    clearResults();
    disableButtons();
    getPokemonData(displayLimit, 0, false);
});

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

const randomizerButton = document.getElementById('randomizer');
randomizerButton.addEventListener('click', function () {
    clearResults();
    disableButtons();
    getPokemonData(displayLimit, 0, true);
});

const previousButton = document.getElementById('previous-button');
previousButton.addEventListener('click', () => {
    disableButtons();
    clearResults();

    if (mode === "normal" && offset >= 0) {
        offset -= 20;
        getPokemonData(displayLimit, offset, false);
    }
    else if (mode === "random") {
        getPokemonData(displayLimit, 0, true);
    }
    else if (mode === "infographic") {
        const resultsElement = document.getElementById("results");
        resultsElement.innerHTML = "";
        getPokemon(currentID - 1);
    }
});

const nextButton = document.getElementById('next-button');
nextButton.addEventListener('click', () => {
    disableButtons();
    clearResults();

    if (mode === "normal" && offset <= 1015) {
        offset += 20;
        getPokemonData(displayLimit, offset, false);
    }
    else if (mode === "random") {
        getPokemonData(displayLimit, 0, true);
    }
    else if (mode === "infographic") {
        const resultsElement = document.getElementById("results");
        resultsElement.innerHTML = "";
        getPokemon(currentID + 1);
    }
});

const storageButton = document.querySelector("#favorite");
storageButton.addEventListener("click", function () {
    loadSavedPokemon();
});