// global variables
var citySearch = document.querySelector('#citySearchName');
var cityListParent = document.querySelector('#possibleCityList');
var possibleCityList = []
var city = [];
var cityName = '';
var lat = 0;
var long = 0;

var weatherAPI = "443fd44db44ccc0f0052388e64bdf96f";

// add listener to submit button
console.log(document.querySelector('#submit'));
document.querySelector('#submit').addEventListener("click", searchCity);

//populate last 5 city searches and initialize local storage array if none present
var lastFiveCity = JSON.parse(localStorage.getItem("lastFiveCityLocal"));
console.log(lastFiveCity)
if (lastFiveCity === null) {
    lastFiveCity = [];
    localStorage.setItem("lastFiveCityLocal", JSON.stringify("LastFiveCity"))
} else {
    for (let i = 0; i < lastFiveCity.length; i++) {
        var pastSearchParent = document.querySelector('#pastSearches');
        var pastButton = document.createElement('button');
        pastButton.textContent = lastFiveCity[i][0];
        pastButton.classList.add('w-100', 'pastSearchBtn', 'text-light', 'mb-2', 'p-2', 'rounded', 'font-weight-bold')
        pastSearchParent.appendChild(pastButton);
    }

}


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

            });
    } else {
        var cityURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityArray[0] + ',' + cityArray[1] + '&limit=5&appid=' + weatherAPI;
        fetch(cityURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                if (data.length > 1) {
                    possibleCityList = data;
                    chooseCity(data);
                }
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
    var cityLatLongURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&units=imperial&appid=' + weatherAPI;
    console.log(cityLatLongURL);
    fetch(cityLatLongURL)
        .then(function (response) {
            return response.json();

        })
        .then(function (data) {
            console.log(lastFiveCity);
            //check to see if duplicate name, add to beginning of array if undefined
            if (lastFiveCity.includes(data.name) === false) {
                
                lastFiveCity.unshift([data.name, cityLatLongURL]);
            } 
            // if array > 5 then remove the last value
            if (lastFiveCity.length > 5) {
                lastFiveCity.pop();
            }
            localStorage.setItem('lastFiveCityLocal', JSON.stringify(lastFiveCity));
            var pastSearchParent = document.querySelector('#pastSearches');
            var pastButton = document.createElement('button');

            pastButton.textContent = data.name;
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
            // API arrays for 3hour forecasts
            // for (let i = 0; i < 6; i++) {
            //     console.log(data)
            //     console.log(data.list[0])
            //     console.log(data.list[1])
            //     console.log(moment(data.list[1].dt, 'X').format('dddd, MMMM Do YYYY'));
            //     console.log(moment(data.list[2].dt, 'X').format('dddd, MMMM Do YYYY'));
            //     console.log(moment(data.list[3].dt, 'X').format('dddd, MMMM Do YYYY'));
            //     console.log(moment(data.list[4].dt, 'X').format('dddd, MMMM Do YYYY'));
            //     console.log(moment(data.list[5].dt, 'X').format('dddd, MMMM Do YYYY'));
            //     var finalCityName = data.city.name
            //     let date = moment(data.list[i].dt, 'X').format('dddd, MMMM Do YYYY');
            //     let currentTemp = Math.round(data.list[i].main.temp);  
            //     let minTemp = Math.round(data.list[i].main.temp_min);         
            //     let maxTemp = Math.round(data.list[i].main.temp_max);
            //     let humidity = data.list[i].main.humidity;
            //     let windSpeed = Math.round(data.list[i].wind.speed);
            //     let windGust = Math.round(data.list[i].wind.gust);
            //     let chanceOfRain = (data.list[i].pop * 100);
            //     let conditions = data.list[i].weather[0].main;
            //     let conditionsIcon = data.list[i].weather[0].icon;
            //     let feelsLike = Math.round(data.list[i].main.feels_like);
            //     let dateShort = moment(data.list[i].dt, 'X').format('ddd, MMM Do');
            //     console.log(dateShort)
            //     if (i === 0) {
            //         document.getElementById('todayDate').innerHTML = finalCityName + " on " + date + ".  <img src=" + "'http://openweathermap.org/img/wn/" + conditionsIcon + "@2x.png' alt='weather conditions'>";
            //         document.getElementById('weatherDesc').textContent = "It's " + conditions + " and " + currentTemp + " degrees, although it feels like " + feelsLike + " degrees. There's currently a " + chanceOfRain + "% chance of rain.";
            //         document.getElementById('windDesc').textContent = "Winds are at " + windSpeed + " MPH with gusts up to " + windGust + " MPH.";
            //         var minLi = document.createElement('li');
            //         minLi.innerHTML = "<strong>Low:</strong>  " + minTemp + " degrees";
            //         document.getElementById('highsLows').appendChild(minLi);
            //         var maxLi = document.createElement('li');
            //         maxLi.innerHTML = "<strong>High:</strong>  " + maxTemp + " degrees";
            //         document.getElementById('highsLows').appendChild(maxLi);
            //         var humid = document.createElement('li');
            //         humid.innerHTML = "<strong>Humidity:</strong>  " + humidity + "%";
            //         document.getElementById('highsLows').appendChild(humid);


            //     } else  {
            //         console.log(dateShort)
            //         console.log(date);
            //         var mainCard = document.getElementById(i);
            //         console.log(mainCard)
            //         var fiveDayCardTitle = mainCard.querySelector('.card-title')
            //         console.log(fiveDayCardTitle)
            //         fiveDayCardTitle.textContent = dateShort;
            //         mainCard.querySelector('.card-text').innerHTML = "<img src=" + "'http://openweathermap.org/img/wn/" + conditionsIcon + "@2x.png' alt='weather conditions'>";

            //     }


            //POPULATE THE CURRENT DAY WEATHER
            console.log(data)

            var finalCityName = data.name
            let date = moment(data.dt, 'X').format('dddd, MMMM Do YYYY');
            let currentTemp = Math.round(data.main.temp);
            let minTemp = Math.round(data.main.temp_min);
            let maxTemp = Math.round(data.main.temp_max);
            let humidity = data.main.humidity;
            let windSpeed = Math.round(data.wind.speed);
            let windGust = Math.round(data.wind.gust);

            let conditions = data.weather[0].description;
            let conditionsIcon = data.weather[0].icon;
            let feelsLike = Math.round(data.main.feels_like);
            let dateShort = moment(data.dt, 'X').format('ddd, MMM Do');
            console.log(dateShort)
            document.getElementById('highsLows').innerHTML = "";
            document.getElementById('todayDate').innerHTML = finalCityName + " on " + date + ".  <img src=" + "'http://openweathermap.org/img/wn/" + conditionsIcon + "@2x.png' alt='weather conditions'>";
            document.getElementById('weatherDesc').textContent = "It's " + conditions + " and " + currentTemp + " degrees, although it feels like " + feelsLike + " degrees.";
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
            
            });

        

};

