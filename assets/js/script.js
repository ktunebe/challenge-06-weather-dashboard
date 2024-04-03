// API Key variable
const APIKey = '2131c7561a194ff2ef8e7f4a9160a776';

// Select html elements
const cityInputForm = document.querySelector('#cityInputForm');
// const prevCityButton = document.querySelectorAll('.prevCityButton');
const cityInput = document.querySelector('#cityInput')
const prevCitiesList = document.querySelector('#prevCities');
const currentCity = document.querySelector('#currentCity');
const currentCityTemp = document.querySelector('#currentCityTemp');
const currentCityWind = document.querySelector('#currentCityWind');
const currentCityHumidity = document.querySelector('#currentCityHumidity');
const selectedCityConditions = document.querySelector('#selectedCityConditions');
const fiveDayRow = document.querySelector('#fiveDayRow');

// Set initial city to last city looked at from local storage or use Chicago as a default
let city = localStorage.getItem('currentCity') || 'Chicago';
// Set searched city history from local storage or start empty array
let cityList = JSON.parse(localStorage.getItem('cityList')) || [];

/* --------------FUNCTIONS DEALING WITH CITY SEARCH LIST---------------- */
// Render City List with delete buttons
function renderCityList() {
    resetCityList();
    for (const city of cityList) {
        cityButtonContainer = document.createElement('div')
        cityButtonContainer.classList.add('my-1')
        prevCityButton = document.createElement('button');
        deleteCityButton = document.createElement('button')
        prevCityButton.classList.add('prevCityButton');
        deleteCityButton.classList.add('deleteCityButton')
        prevCityButton.innerText = city;
        deleteCityButton.innerText = 'X'
        cityButtonContainer.append(deleteCityButton);
        cityButtonContainer.append(prevCityButton);
        prevCitiesList.append(cityButtonContainer);
    }
}
// Add searched cities to list
function addCityToList() {
    if (cityInput.value !== '') {
        let searchedCityEntered = cityInput.value;
        let searchedCityLower = searchedCityEntered.toLowerCase();
        let searchedCity = searchedCityLower.charAt(0).toUpperCase() + searchedCityLower.slice(1);
        if (!cityList.includes(searchedCity)) {
            cityList.push(searchedCity);
        }
        localStorage.setItem('cityList', JSON.stringify(cityList))
    }
    return cityList;
}
// Reset City List
function resetCityList() {
    prevCitiesList.innerText = '';
}


/* --------------------- RENDERING CITY CONDITIONS ------------------------- */
// Setting emoji based on conditions
function setWeatherEmoji (day) {
    let emoji;
    if (day.weather[0].main === "Clouds") {
        emoji = '🌥️';
    } else if (day.weather[0].main === "Clear") {
        emoji = '🌞';
    } else if (day.weather[0].main === "Drizzle" || day.weather[0].main === "Rain") {
        emoji = '🌧️';
    } else if (day.weather[0].main === "Thunderstorm") {
        emoji = '⛈️';
    } else if (day.weather[0].main === "Snow") {
        emoji = '❄️';
    // Most other weather conditions listed are fog-like conditions
    } else {emoji = '😶‍🌫️'}
    return emoji;
}
// Render current city conditions
function renderCurrentCity(city) {
    currentCity.textContent = `${city.name} ${dayjs().format('M/DD/YYYY')} ${setWeatherEmoji(city)}` 
    currentCityTemp.textContent = `Temp: ${city.main.temp}\u00B0F`
    currentCityWind.textContent = `Wind: ${city.wind.speed} MPH`
    currentCityHumidity.textContent = `Humidity: ${city.main.humidity}%`
}
// Render five day forecast
function renderFiveDay() {
    // Create elements
    const fiveDayCard = document.createElement('div');
    fiveDayCard.classList.add('card', 'forecast-card', 'col-xs-12', 'col-md-4', 'col-xl', 'mb-2');
    const dateHeader = document.createElement('div');
    dateHeader.classList.add('card-header');
    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    const temp = document.createElement('li');
    temp.classList.add('list-group-item');
    const wind = document.createElement('li');
    wind.classList.add('list-group-item');
    const humidity = document.createElement('li');
    humidity.classList.add('list-group-item');
    // Fill in data
    dateHeader.innerText = `${dayjs(fiveDay.list[i].dt_txt).format('M/DD/YYYY')} ${setWeatherEmoji(fiveDay.list[i])}` ;
    temp.innerText = ` Temp: ${fiveDay.list[i].main.temp}\u00B0F`;
    wind.innerText = `Wind: ${fiveDay.list[i].wind.speed} MPH`;
    humidity.innerText = `Humidity: ${fiveDay.list[i].main.humidity}%`;
    // Append to document
    ul.append(temp, wind, humidity);
    fiveDayCard.append(dateHeader, ul);
    fiveDayRow.append(fiveDayCard);
}
// Remove elements created in renderFiveDay()
function resetFiveDay() {
    fiveDayRow.innerText = ''
}

/* ----------------- MAIN FUNCTION ------------------------ */
// Function to get and render data
function handleCityInput(city) {
    // OpenWeather API call for current city using city name
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;
    fetch(queryURL)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('City not found. Please enter a valid city name.');
            }
            resetFiveDay()
            addCityToList();
            renderCityList();
            localStorage.setItem('currentCity', city);
            cityInput.value = '';
            return response.json();
        })
        .then(function(cityData) {
            city = cityData;
            renderCurrentCity(city);
            // Five day forecast requires latitude and longitude
            const cityLat = city.coord.lat;
            const cityLon = city.coord.lon;
            // OpenWeather API call for five day forecast
            const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${cityLat}&lon=${cityLon}&cnt=50&appid=${APIKey}&units=imperial`;
            return fetch(fiveDayURL);
        })
            .then(function(response) {
                return response.json();              
            })
            .then(function(fiveDayData) {
                fiveDay = fiveDayData;
                
                for (i = 7; i <= 39 ; i += 8) {
                    renderFiveDay()
                }
            }) 
            .catch(function(error) {
                alert(error.message); 
                return;
            });   
            
            
}
/* ----------------------------------------------------------------------------- */
// Init - Grab last city looked at and render the weather data and create history list from local storage
handleCityInput(city);
renderCityList();

// Event Listeners
// Handle new city on form input
cityInputForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let city = cityInput.value;
    handleCityInput(city)
})
// Set current city to whatever city button is clicked
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('prevCityButton')) {
        city = e.target.innerText;
        handleCityInput(city);
        localStorage.setItem('currentCity', city);
    }
})
// Handle deleting a city button from the list and removing that city from the list
document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('deleteCityButton')) {
        buttonToDelete = e.target.parentNode;
        citytoDelete = e.target.nextSibling.innerText;
        buttonToDelete.remove();
        cityList = cityList.filter(function(city) {
            return city !== citytoDelete;
        })
        localStorage.setItem('cityList', JSON.stringify(cityList))
        return cityList;
    }
})
