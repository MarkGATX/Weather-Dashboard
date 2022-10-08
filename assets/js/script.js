// global variables
var citySearch = document.querySelector('#citySearchName');
var cityListParent = document.querySelector('#possibleCityList');
var possibleCityList = []
var city = [];
var cityName ='';
var lat = 0;
var long = 0;
var lastFiveCity =[];
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
        var cityURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityArray[0] + '&limit=5&appid=' + weatherAPI;
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
        var cityURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityArray[0] + ',' + cityArray[1]+ '&limit=5&appid=' + weatherAPI;
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
    var cityURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=5&appid='  + weatherAPI;
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
    for (i=0; i<possibleCityList.length; i++) {
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
    var cityLatLongURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&units=imperial&appid='  + weatherAPI;
    console.log(cityLatLongURL);
    fetch(cityLatLongURL)
        .then(function (response) {
            return response.json();
            
        })
        .then(function (data) {
            console.log(data);
            lastFiveCity.push(data);
            console.log(lastFiveCity)
            localStorage.setItem('fiveWeatherSearches', JSON.stringify(lastFiveCity));
            for (let i = 0; i<5; i++) {
                console.log(i)
                var finalCityName = data.city.name
                var date = moment(data.list[i].dt, 'X').format('dddd, MMMM Do YYYY');
                var currentTemp= Math.round(data.list[i].main.temp);
                console.log(currentTemp);
                var minTemp= Math.round(data.list[i].main.temp_min);
                console.log(data.list[0])
                var maxTemp= Math.round(data.list[i].main.temp_max);
                var humidity= data.list[i].main.humidity;
                var windSpeed= data.list[i].wind.speed;
                var windGust = data.list[i].wind.gust;
                var chanceOfRain = (data.list[i].pop * 100);
                var conditions = data.list[i].weather[0].main;
                var conditionsIcon = data.list[i].weather[0].icon;
                var feelsLike = Math.round(data.list[i].main.feels_like);
                if (i===0) {
                       document.getElementById('todayDate').textContent = finalCityName + ' on ' + date;
                    document.getElementById('weatherDesc').textContent = "It's " + conditions + " and " + currentTemp + " degrees, although it feels like " + feelsLike + " degrees. There's currently a " + chanceOfRain + "% chance of rain. ";
                    document.getElementById('windDesc').textContent = "Winds are at " + windSpeed + " MPH with gusts up to " + windGust + " MPH.";
                    var minLi = document.createElement('li');
                    minLi.textContent = "Low: " + minTemp + " degrees";
                    document.getElementById('highsLows').appendChild(minLi);
                    var maxLi = document.createElement('li');
                    maxLi.textContent = "High: " + maxTemp + " degrees";
                    document.getElementById('highsLows').appendChild(maxLi);
                    var humid = document.createElement('li');
                    humid.textContent = "Humidity: " + humidity ;
                    document.getElementById('highsLows').appendChild(humid);
                    document.getElementById('weatherIcon').style.backgroundImage = "url('http://openweathermap.org/img/wn/" + conditionsIcon + "@2x.png";

                } else {

                }
        }; 
    });
}
