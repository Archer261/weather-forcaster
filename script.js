// API key
var APIKey = '0921cf8315a06211d5c903665ccab12f';

// API Call Variables
var city = 'Chicago';
var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`

function getForecastData() {
    // Convert city name to lat and lon
    fetch(queryURL)
        .then((res) => res.json())
        .then((data) => console.log(data));

    // fetch(queryURL)
    //     .then((res) => res.json())
    //     .then((data) => console.log(data));


}

// function convertCity() {
//     fetch(`https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${APIKey}`)
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// }

getForecastData();