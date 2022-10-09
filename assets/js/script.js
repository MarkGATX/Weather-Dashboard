// global variables
var citySearch = document.querySelector('#citySearchName');
var cityListParent = document.querySelector('#possibleCityList');
var possibleCityList = []
var city = [];
var cityName = '';
var lat = 0;
var long = 0;
var lastFiveCity = [];
var weatherAPI = "443fd44db44ccc0f0052388e64bdf96f";

// add listener to submit button
document.querySelector('#submit').addEventListener("click", searchCity);
console.log(weatherAPI)


//call weatherapi and find city and weather
function searchCity(event) {
    event.preventDefault();
    city = citySearch.value.trim();
    var cityArray = city.split(',');
    if (cityArray.length === 1) {
        var cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityArray[0] + '&limit=5&appid=' + weatherAPI;
        fetch(cityURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.length > 1) {
                    possibleCityList = data;
                    chooseCity(data);
                }
                console.log(data);
            });
    } else {
        var cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityArray[0] + ',' + cityArray[1] + '&limit=5&appid=' + weatherAPI;
        console.log(cityURL);
        fetch(cityURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.length > 1) {
                    possibleCityList = data;
                    chooseCity(data);
                }
                console.log(data);
            });
    }
    console.log(cityArray);
    console.log(city);
    // if (city)
    var cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid=' + weatherAPI;
    console.log(cityURL);
    fetch(cityURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length > 1) {
                possibleCityList = data;
                chooseCity(data);
            } else {
                lat = data.lat;
                long = data.lon;
                latLongWeatherRequest();
            }
            console.log(data);
        });
}


//Populate choice for multiple cities
function chooseCity(data) {
    // Build city list after clearing field first 
    cityListParent.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        var cityListEl = document.createElement('li');
        cityListEl.textContent = data[i].name + ", " + data[i].state;
        console.log(cityListEl);
        console.log(cityListParent)
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
        if (cityName === possibleCityList[i].name + ", " + possibleCityList[i].state) {
            lat = possibleCityList[i].lat;
            long = possibleCityList[i].lon
            latLongWeatherRequest();
            return;
        }
    }
    console.log(cityName);
}

//submit weather request with lat and long
function latLongWeatherRequest() {
    console.log(lat + "," + long);
    var cityLatLongURL = 'http://api.openweathermap.org/data/2.5/forecast/daily?lat=' + lat + '&lon=' + long + '&units=imperial&appid=' + weatherAPI;
    console.log(cityLatLongURL);
    fetch(cityLatLongURL)
        .then(function (response) {
            return response.json();

        })
        .then(function (data) {

            lastFiveCity.push(data);

            localStorage.setItem('fiveWeatherSearches', JSON.stringify(lastFiveCity));
            for (let i = 0; i < 6; i++) {
                console.log(data)
                console.log(data.list[0])
                console.log(data.list[1])
                console.log(moment(data.list[1].dt, 'X').format('dddd, MMMM Do YYYY'));
                console.log(moment(data.list[2].dt, 'X').format('dddd, MMMM Do YYYY'));
                console.log(moment(data.list[3].dt, 'X').format('dddd, MMMM Do YYYY'));
                console.log(moment(data.list[4].dt, 'X').format('dddd, MMMM Do YYYY'));
                console.log(moment(data.list[5].dt, 'X').format('dddd, MMMM Do YYYY'));
                var finalCityName = data.city.name
                let date = moment(data.list[i].dt, 'X').format('dddd, MMMM Do YYYY');
                let currentTemp = Math.round(data.list[i].main.temp);  
                let minTemp = Math.round(data.list[i].main.temp_min);         
                let maxTemp = Math.round(data.list[i].main.temp_max);
                let humidity = data.list[i].main.humidity;
                let windSpeed = Math.round(data.list[i].wind.speed);
                let windGust = Math.round(data.list[i].wind.gust);
                let chanceOfRain = (data.list[i].pop * 100);
                let conditions = data.list[i].weather[0].main;
                let conditionsIcon = data.list[i].weather[0].icon;
                let feelsLike = Math.round(data.list[i].main.feels_like);
                let dateShort = moment(data.list[i].dt, 'X').format('ddd, MMM Do');
                console.log(dateShort)
                if (i === 0) {
                    document.getElementById('todayDate').innerHTML = finalCityName + " on " + date + ".  <img src=" + "'http://openweathermap.org/img/wn/" + conditionsIcon + "@2x.png' alt='weather conditions'>";
                    document.getElementById('weatherDesc').textContent = "It's " + conditions + " and " + currentTemp + " degrees, although it feels like " + feelsLike + " degrees. There's currently a " + chanceOfRain + "% chance of rain.";
                    document.getElementById('windDesc').textContent = "Winds are at " + windSpeed + " MPH with gusts up to " + windGust + " MPH.";
                    var minLi = document.createElement('li');
                    minLi.innerHTML = "<strong>Low:</strong>  " + minTemp + " degrees";
                    document.getElementById('highsLows').appendChild(minLi);
                    var maxLi = document.createElement('li');
                    maxLi.innerHTML = "<strong>High:</strong>  " + maxTemp + " degrees";
                    document.getElementById('highsLows').appendChild(maxLi);
                    var humid = document.createElement('li');
                    humid.innerHTML = "<strong>Humidity:</strong>  " + humidity + "%";
                    document.getElementById('highsLows').appendChild(humid);


                } else  {
                    console.log(dateShort)
                    console.log(date);
                    var mainCard = document.getElementById(i);
                    console.log(mainCard)
                    var fiveDayCardTitle = mainCard.querySelector('.card-title')
                    console.log(fiveDayCardTitle)
                    fiveDayCardTitle.textContent = dateShort;
                    mainCard.querySelector('.card-text').innerHTML = "<img src=" + "'http://openweathermap.org/img/wn/" + conditionsIcon + "@2x.png' alt='weather conditions'>";

                }
            };
        });
}
