// slide element
let forecastPane = document.querySelector('.slide');



// global variables
var citySearch = document.querySelector('#citySearchName');
var cityListParent = document.querySelector('#possibleCityList');
var possibleCityList = []
var city = [];
var cityName = '';
var lat = 0;
var long = 0;
var cityLatLongURL = ""


// weather APIs
var weatherAPI = "443fd44db44ccc0f0052388e64bdf96f";
var weatherBitAPI = "cee3158b81624efdb69c85c5b782d480";


// add listener to submit button
document.querySelector('#submit').addEventListener("click", searchCity);


//populate last 5 city searches and initialize local storage array if none present
var lastFiveCity = JSON.parse(localStorage.getItem("lastFiveCityLocal"));
if (lastFiveCity === null) {
    lastFiveCity = [];
    localStorage.setItem("lastFiveCityLocal", JSON.stringify("LastFiveCity"))
} else {
    for (let i = 0; i < lastFiveCity.length; i++) {
        var pastSearchParent = document.querySelector('#pastSearches');
        var pastButton = document.createElement('button');
        pastButton.textContent = lastFiveCity[i][0];
        pastButton.classList.add('w-100', 'pastSearchBtn', 'text-light', 'mb-2', 'p-2', 'rounded', 'font-weight-bold', 'col-sm-12');
        pastSearchParent.appendChild(pastButton);
    }
}
pastSearchParent.addEventListener("click", pullLocalStorage)

// Get previous search endpoints
function pullLocalStorage(event) {
    event.preventDefault();
    forecastPane.style.transform = "translateX(3000px)";
    cityName = event.target.textContent;
    lastFiveCity = JSON.parse(localStorage.getItem("lastFiveCityLocal"));
    for (let i = 0; i < lastFiveCity.length; i++) {
        if (cityName === lastFiveCity[i][0]) {
            cityLatLongURL = lastFiveCity[i][1];
            setTimeout(latLongWeatherRequest, 500)
            return
        }
    }
}


//call weatherapi and find city and weather
function searchCity(event) {
    event.preventDefault();
    forecastPane.style.transform = "translateX(3    000px)";
    if (citySearch.value === "") {
        $('#noSearchContentWarning').modal();
        return;
    }
    // city = citySearch.value.trim();
    city = citySearch.value;
    if (city.includes('city') || city.includes('City')) {
        let minusCity = city.replace("City", " ");
        city = minusCity;
    }
    city = city.trim();
    city = city.split(' ').join('+');
    var cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + weatherAPI;
    fetch(cityURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length === 0) {
                $('#noResultsWarning').modal();
                citySearch.value = "";
                return;
            }
            if (data.length > 1) {
                possibleCityList = data;
                chooseCity(data);
            } else {
                lat = data[0].lat;
                long = data[0].lon;
                latLongWeatherRequest();
            };
        });
}



//Populate choice for multiple cities
function chooseCity(data) {
    // Build city list after clearing field first 
    cityListParent.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        var cityListEl = document.createElement('li');
        cityListEl.classList.add('cityOptionList', 'text-light', 'mb-2', 'p-2', 'rounded');
        if (data[i].state === undefined) {
            cityListEl.textContent = data[i].name + ", " + data[i].country;
        } else {
            cityListEl.textContent = data[i].name + ", " + data[i].state + ", " + data[i].country;
        };
        cityListParent.appendChild(cityListEl);
        cityListParent.addEventListener("click", getLatLong);
    }
    $('#citySelection').modal()
}

//get latitude and longitude from chosen city
function getLatLong(city) {
    cityName = city.target.textContent;
    $('#citySelection').modal('hide');
    //cycle through array of cities for a match then pull lat and long
    for (i = 0; i < possibleCityList.length; i++) {
        if (cityName === possibleCityList[i].name + ", " + possibleCityList[i].country || cityName === possibleCityList[i].name + ", " + possibleCityList[i].state + ", " + possibleCityList[i].country) {
            lat = possibleCityList[i].lat;
            long = possibleCityList[i].lon
            cityLatLongURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=' + lat + '&lon=' + long + '&key=' + weatherBitAPI;
            latLongWeatherRequest();
            return;
        }
    }
}

//submit weather request with lat and long and store new local array
function latLongWeatherRequest() {
    fetch(cityLatLongURL)
        .then(function (response) {
            return response.json();

        })
        .then(function (data) {
            //check to see if duplicate name, 
            let dataCityNameCap = data.city_name;
            dataCityNameCap.toUpperCase();
            for (let i = 0; i < lastFiveCity.length; i++) {
                if (data.city_name.toUpperCase() === lastFiveCity[i][0].toUpperCase()) {
                    var dupeCity = true;
                    break;
                }
            }
            // if  duplicate name, fill out forecast
            if (dupeCity === true) {
                popWeatherForecast(data);
                return;
            }

            //if no dupe, add to array
            lastFiveCity.unshift([data.city_name, cityLatLongURL]);

            // if array > 5 then remove the last value
            if (lastFiveCity.length > 5) {
                lastFiveCity.pop();
            }

            //add previous search button
            localStorage.setItem('lastFiveCityLocal', JSON.stringify(lastFiveCity));
            var pastSearchParent = document.querySelector('#pastSearches');
            var pastButton = document.createElement('button');
            pastButton.textContent = data.city_name;
            pastButton.classList.add('w-100', 'pastSearchBtn', 'text-light', 'mb-2', 'p-2', 'rounded', 'font-weight-bold');
            var buttonListParent = document.getElementById('pastSearches');
            //if at least 1 child li, add the next at the beginning of the list
            if (buttonListParent.childElementCount > 0) {
                pastSearchParent.insertBefore(pastButton, pastSearchParent.firstChild);
            } else {
                pastSearchParent.appendChild(pastButton)
            }
            //remove button greater than 5 under search input
            if (buttonListParent.childElementCount > 5) {
                buttonListParent.removeChild(buttonListParent.lastChild);
            }
            popWeatherForecast(data);
        })
}


function popWeatherForecast(data) {
    // Use weatherBit data for daily forecast
    for (let i = 0; i < 6; i++) {
        var finalCityName = data.city_name
        let date = moment(data.data[i].ts, 'X').format('dddd, MMMM Do YYYY');
        let currentTemp = ((Math.round(data.data[i].temp)) * 9 / 5) + 32;
        let minTemp = ((Math.round(data.data[i].low_temp)) * 9 / 5) + 32;
        let maxTemp = ((Math.round(data.data[i].high_temp)) * 9 / 5) + 32;
        let humidity = data.data[i].rh;
        let windSpeed = (Math.round((data.data[i].wind_spd) * 2.237));
        let windGust = (Math.round((data.data[i].wind_gust_spd) * 2.237));
        let chanceOfRain = (data.data[i].pop);
        let conditions = data.data[i].weather.description;
        let conditionsIcon = data.data[i].weather.icon;
        let dateShort = moment(data.data[i].ts, 'X').format('ddd, MMM Do');
        if (i === 0) {
            //populate current conditions
            document.getElementById('todayDate').innerHTML = finalCityName + " on " + date + ".  <img src=" + "'https://www.weatherbit.io/static/img/icons/" + conditionsIcon + ".png' alt='weather conditions'>";
            document.getElementById('weatherDesc').textContent = conditions + " and " + currentTemp + "° fahrenheit. There's currently a " + chanceOfRain + "% chance of rain.";
            document.getElementById('windDesc').textContent = "Winds are at " + windSpeed + " MPH with gusts up to " + windGust + " MPH.";
            document.getElementById('highsLows').innerHTML = "";
            var minLi = document.createElement('li');
            minLi.innerHTML = "<strong>Nighttime Low:</strong>  " + minTemp + "° ";
            document.getElementById('highsLows').appendChild(minLi);
            var maxLi = document.createElement('li');
            maxLi.innerHTML = "<strong>Daytime High:</strong>  " + maxTemp + "° ";
            document.getElementById('highsLows').appendChild(maxLi);
            var humid = document.createElement('li');
            humid.innerHTML = "<strong>Humidity:</strong>  " + humidity + "%";
            document.getElementById('highsLows').appendChild(humid);


        } else {
            //populate future weather
            var mainCard = document.getElementById(i);
            var fiveDayCardTitle = mainCard.querySelector('.card-title  ')
            fiveDayCardTitle.textContent = dateShort;
            mainCard.querySelector('.card-text').innerHTML = "<img class='w-100' src=" + "'https://www.weatherbit.io/static/img/icons/" + conditionsIcon + ".png' alt='weather conditions'>";
            var forecastDayHigh = document.createElement('li');
            var forecastNightLow = document.createElement('li');
            var forecastHumid = document.createElement('li');
            var forecastRain = document.createElement('li');
            var forecastWind = document.createElement('li');
            var parentUL = document.getElementById(i);
            parentUL.nextElementSibling.innerHTML = "";
            forecastDayHigh.textContent = 'High: ' + (((Math.round(data.data[i].high_temp)) * 9 / 5) + 32) + '°'
            forecastNightLow.textContent = 'Low: ' + (((Math.round(data.data[i].low_temp)) * 9 / 5) + 32) + '°'
            forecastRain.textContent = 'Rain: ' + (data.data[i].pop) + '%'
            parentUL.nextElementSibling.appendChild(forecastDayHigh);
            parentUL.nextElementSibling.appendChild(forecastNightLow);
            parentUL.nextElementSibling.appendChild(forecastRain);
        }
    }
    forecastPane.style.transform = "translateX(0)";
    return
}