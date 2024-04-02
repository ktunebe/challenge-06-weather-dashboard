// API Key variable
const APIKey = '2131c7561a194ff2ef8e7f4a9160a776';

// Select html elements
const searchBtn = document.querySelector('#searchBtn');
const previousCitiesList = document.querySelector('#previousCities');
const selectedCityName = document.querySelector('#selectedCityName');
const selectedCityConditions = document.querySelector('#selectedCityConditions')

// Query variables
let city = 'Chicago,us';
const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

function test() {
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
        })
}

test();
