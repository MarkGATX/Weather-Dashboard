# Weather Forecast Dashboard


## The sixth challenge in the UT-Austin Full Stack Development Bootcamp - Create a Weather Dashboard


___


This project was assigned for the sixth project in the UT-Austin Full Stack Development Bootcamp. It's meant to familiarize students with using third-party APIs while also taking advantage of local storage and front-end frameworks like Bootstrap

There were several challenges to completing this project, but the lessons were learned. I'll go over changes in the code and bugs that persist later in the README. For now let's go over how to use the app.

[You can see it live here](https://markgatx.github.io/Weather-Dashboard-Full-Stack-Bootcamp/)


___



## How to use

When you open up the page for the first time, you'll see the Weather Dashboard header. To the left will be a search area with a search box. Type in the name of a city you're looking for and click "Search."

![Weather Dashboard Screenshot](./assets/images/Weather%20Dashboard%20small%20Screenshot.jpg)


If there are multiple options for your city, a modal will pop up asking you to choose from one of five choices. Click on one of the city names to choose the city to search for.

Once you select your city, a dashboard will slide in with the current conditions as well as a five-day forecast. (The original brief called for temperature, wind speed, and humidity. While I did pull this data and included it in the current condiditons, for the forecast I only included high and low temperatures as well as rain chance and the weather icon. I did this mainly because I find that information more generally useful than humidity)

Under the search box, a new button will appear with the name of the city you just searched. In the future you can simply click on that button to get weather information for that city. The page will keep a record of the last five cities you searched for.


___


## Changes Made and Lessons Learned

- The original layout in the challenge documentation stayed as the inspiration for the overall look of the page. I did change the color scheme in some places and I also did some simple skey transformations of some elements to get the diagonal lines in the search area. This is only seen at larger screen sizes since it took up too much vertical space at mobile sizes.

- I conversations with a classmate,  [AWoelf](https://github.com/awoelf) mentioned she had developed some higher resolution weather icons for use with weatherbit.io. I immediately got good links and switched them out for a distinct improvement in the overall look and feel.

- The assignment was to use the [OpenWeatherMap API](https://openweathermap.org/api) to populate a forecast for the weather. After buidling the code base to use the response from OpenWeather, I realized the temperatures and forecasts didn't look right. I quickly realized the response was for every three hours, not every day. Access to a daily forecast seems to be behind a paid plan. There may be a way to pull the data but it's not straightforward and my OCD tendencies wouldn't let me just pull data as if it applied to the whole day. So I found another weather API that has reasonable limits on its use. Since I already had the code in place to leverage OpenWeather to get latitude and longitude for cities, I simply changed the endpoint of the forecast to [Weatherbit.io](https://weatherbit.io). The response works well and I personally feel the API is simpler to use, as long as my app doesn't get extremely popular and I suddenly find myself paying for it.

 - The OpenWeatherMap API has some significant quirks about it. One of the most frustrating was a problem I stumbled upon while testing. Every city I tested worked fine, except for Mexico City. I couldn't even really find where the error was to launch a modal notifying the user. Then I realized that New York City also didn't work. Neither did Panama City. The common thread was the word "city" in the search. I wrote some code to extract "city" from the search term and suddenly every thing worked perfectly again. My guess is that city is a word that breaks the request on the OpenWeatherMap side. But I've programmed in a work-around to fix it.

 - The limitations of bootstrap became fairly apparent. I realized that bootstrap can take a developer a long way in getting a page up to speed quickly. I also realized that for some more advanced functionality or creative CSS, you'll need to add custom code to your page. Most of what I wanted to accomplish was avaiable in the native bootstrap framework, but what I couldn't find was easily added with some custom classes and media queries.

 - I experimented with css element transformations with javascript. I did have to add some intervals to slow things down a bit in places or else things would update before animations finished. 



___



## Possible Future Changes

- Fix the problem with some international cities. Would probably require refactoring code to use WeatherBit.io exclusively
- animated background images that correspond to the weather codes to make the page look more dynamic



___



## Credits
Special thanks to [AWoelf](https://github.com/awoelf) for the amazing improved icons to use for the weather app. These are high-quality .png files that are vastly superior to the ones provided natively from Weatherbit.io. [I'd highly recommend looking for these if you need icons for your app.](https://github.com/awoelf/weather-tips-app)

The original visual concept of the dashboard was created by staff of the UT Austin Full Stack Development Bootcamp. Thanks to Leah, Ian, Negin, Diem, and all the students who work with me daily to keep improving. 

The simple idea for using a skew transform to add a more dynamic look to the page came from [Nils Binder in 9elements](https://9elements.com/blog/pure-css-diagonal-layouts/))

___



## License

MIT License

Copyright (c) 2022 Mark Gardner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
