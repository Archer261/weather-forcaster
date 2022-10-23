// API key
var APIKey = '0921cf8315a06211d5c903665ccab12f';

// API Call Variables
var city = 'Chicago';
var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
var searchBtn = document.getElementById("search");

// DOM Containers
var cardRow = document.getElementById('forcast-cards');
var cardCol = document.createElement('div').classList.add("col");
var cardH = document.createElement('div').classList.add("card", "h-100");
var cardBody = document.createElement('div').classList.add("card-body");

// searchBtn.addEventListener("click",)

async function getForecastData() {
    // Convert city name to lat and lon
    await fetch(queryURL)
        .then((res) => res.json())
        .then((data) => console.log(data));
    return data

}

// Convert city to latitude and longitude
async function convertCity() {
    let lat = '';
    let lon = '';
    await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
        .then((res) => res.json())
        .then((data) => data.forEach((c) => {
            if (c.country === 'US') {
                console.log(c.lat, c.lon);
                lat = c.lat;
                lon = c.lon;
            }

        }))
    return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
        .then((response) => response.json())
        .then((weekData) => {
            let currentDate = moment().format("DD") - 1;
            weekData.list.forEach((obj) => {
                if (moment(obj.dt_txt).format("DD") > currentDate) {
                    currentDate = moment(obj.dt_txt).format("DD");
                    createWeekForcast(obj.dt_txt, obj.main.temp, obj.wind.speed, obj.main.humidity);
                }
            })
        });
}

// Create 5 Day forcast cards
function createWeekForcast(date, temp, wind, humidity) {
    let cDate = document.createElement("h5").classList.add("card-title").innerHTML(date);
    let cTemp = document.createElement("p").classList.add("card-text").innerHTML(`Temp: ${temp} °F`);
    let cWind = document.createElement("p").classList.add("card-text").innerHTML(`Wind: ${wind} MPH`);
    let cHumidity = document.createElement("p").classList.add("card-text").innerHTML(`Humidity: ${humidity}%`);

    cardRow.appendChild(cardCol);
    cardCol.appendChild(cardH);
    cardH.appendChild(cardBody)
    cardBody.appendChild(cDate);
    cardBody.appendChild(cIcon);
    cardBody.appendChild(cTemp);
    cardBody.appendChild(cWind);
    cardBody.appendChild(cHumidity);
}

// getForecastData();
// convertCity();
// createWeekForcast();
convertCity();