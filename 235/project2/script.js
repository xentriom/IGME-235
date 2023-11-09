const u = `https://pokeapi.co/api/v2/pokemon/pikachu`;

console.log(u);
getData(u);


function getData(url) {
    let xhr = new XMLHttpRequest();

    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    let xhr = e.target;
    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#test").innerHTML = "<b>No results found</b>";
        return;
    }

    let results = obj.data
    console.log("results.length = " + results.length);
}

function dataError(e) {
    console.log("An error occurred");
}