const storageButton = document.querySelector("#favorite");
storageButton.addEventListener("click", function () {
    loadSavedPokemon();
});

function savePokemon(id) {
    if (window.accountName === undefined) {
        alert("You must be logged in to save a Pokemon!");
        return;
    }

    console.log(`Saving Pokemon ${id} for ${window.accountName}`);
    // Retrieve the existing value of the key
    let existingValue = localStorage.getItem(`${accountName}-fav-pkm`);

    // Handle the case if the existing value is null
    if (existingValue === null) {
        existingValue = "";
    }

    // Append the new ID to the existing value
    existingValue += `${id}|`;

    // Update the value of the favorite Pokemon key
    localStorage.setItem(`${accountName}-fav-pkm`, existingValue);
}

function loadSavedPokemon() {
    if (window.accountName === undefined) {
        return;
    }

    const resultsElement = document.getElementById("results");
    resultsElement.innerHTML = "";

    const favoritePokemon = localStorage.getItem(`${accountName}-fav-pkm`);
    if (favoritePokemon === null || favoritePokemon === "") {
        return;
    }

    const pokemonIds = favoritePokemon.split("|");
    for (let i = 0; i < pokemonIds.length - 1; i++) {
        fetchPokemonData(`https://pokeapi.co/api/v2/pokemon/${pokemonIds[i]}`)
    }
}