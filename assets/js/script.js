// API Key variable
const APIKey = '2131c7561a194ff2ef8e7f4a9160a776';

// Select html elements
const searchBtn = document.querySelector('#searchBtn');
const cityButton = document.querySelectorAll('.cityButton');
const cityInput = document.querySelector('#cityInput')
const previousCitiesList = document.querySelector('#previousCities');
const currentCityName = document.querySelector('#currentCityName');
const currentCityTemp = document.querySelector('#currentCityTemp');
const currentCityWind = document.querySelector('#currentCityWind');
const currentCityHumidity = document.querySelector('#currentCityHumidity');
const selectedCityConditions = document.querySelector('#selectedCityConditions');


// Current city conditions
function renderCurrentCity(city) {
    currentCityName.textContent = city.name
    currentCityTemp.textContent = `Temp: ${city.main.temp}\u00B0F`
    currentCityWind.textContent = `Wind: ${city.wind.speed} MPH`
    currentCityHumidity.textContent = `Humidity: ${city.main.humidity}%`
}

function renderFiveDay(city) {
    console.log(city);
}

function test(city) {
    const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    fetch(queryURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(cityData) {
            city = cityData;
            console.log(city);
            renderCurrentCity(city);
            const cityLat = city.coord.lat;
            const cityLon = city.coord.lon;
            const fiveDayURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&appid=${APIKey}&units=imperial`;
            return fetch(fiveDayURL);
        })
            .then(function(response) {
                return response.json();              
            })
            .then(function(data) {
                renderFiveDay(data);
            })
        // })
        
}

searchBtn.addEventListener('click', function(e) {
    e.preventDefault();

    let city = cityInput.value;
    test(city);
})
