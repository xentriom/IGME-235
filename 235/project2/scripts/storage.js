function createFavoriteButton() {
    let saveButton = document.createElement("button");
    saveButton.id = "save";
    saveButton.textContent = "Favorite";
    graphicsSectionDiv.appendChild(saveButton);

    saveButton.addEventListener("click", function () {
        savePokemon(infoMap.get("Id"));
    });
}

function createButton(div, current, id) {
    Array.from(div.childNodes).forEach(node => {
        if (node.tagName === 'BUTTON') {
            div.removeChild(node);
        }
    });

    if (current === "save") {
        let button = document.createElement("button");
        button.id = "button";
        button.textContent = "Favorite";

        button.addEventListener("click", function () {
            savePokemon(id);
            createButton(div, "unsave", id);
        });

        div.appendChild(button);
    }
    else if (current === "unsave") {
        let button = document.createElement("button");
        button.id = "button";
        button.textContent = "Unfavorite";

        button.addEventListener("click", function () {
            removePokemon(id);
            createButton(div, "save", id);
        });

        div.appendChild(button);
    }
}

function savePokemon(id) {
    if (window.accountName === undefined) {
        alert("You must be logged in to save a Pokemon!");
        return;
    }

    if (AlreadySaved(id)) {
        alert("This Pokemon is already saved!");
        return;
    }

    let existingValue = localStorage.getItem(`${accountName}-fav-pkm`);
    if (existingValue === null) {
        existingValue = "";
    }

    existingValue += `${id}|`;
    localStorage.setItem(`${accountName}-fav-pkm`, existingValue);
}

function removePokemon(id) {
    if (window.accountName === undefined) {
        alert("You must be logged in to unsave a Pokemon!");
        return;
    }

    if (!AlreadySaved(id)) {
        alert("This Pokemon is not saved!");
        return;
    }

    let existingValue = localStorage.getItem(`${accountName}-fav-pkm`);
    if (existingValue === null || existingValue === "") {
        return;
    }

    const idArray = existingValue.split("|");

    const indexToRemove = idArray.indexOf(id.toString());
    if (indexToRemove !== -1) {
        idArray.splice(indexToRemove, 1);
    }

    const updatedValue = idArray.join("|");
    localStorage.setItem(`${accountName}-fav-pkm`, updatedValue);
}

function AlreadySaved(id) {
    if (window.accountName === undefined) {
        alert("You must be logged in to check saved Pokemon!");
        return false;
    }

    const existingValue = localStorage.getItem(`${accountName}-fav-pkm`) || "";
    const savedIds = existingValue.split("|");

    return savedIds.includes(id.toString());
}

function loadSavedPokemon() {
    if (window.accountName === undefined) {
        alert("You must be logged in to load saved Pokemon!");
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