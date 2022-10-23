// API key
var APIKey = '0921cf8315a06211d5c903665ccab12f';

// API Call Variables
var city = 'Chicago';
var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`
var searchBtn = $("#search");

// DOM Elements
const cityHistory = $('#city-history');


// Utilities
function formatDate(date) {
    return `${moment(date).format("M")}/${moment(date).format("DD")}/${moment(date).format("YYYY")}`
}


// Function that adds search history to local storage after api call and creates button
function addCityHistory() {
    searchBtn.on("click", () => {
        newCity = $("#city-input").val();
        if (newCity.length > 0) {
            if (Object.keys(localStorage).includes(`ls-${newCity}`)) {
                return;
            } else {
                localStorage.setItem(`ls-${newCity}`, newCity)
                const add = $(`<div class=" m-1 row"><button id="ls-${newCity}" class="btn btn-secondary btn-block" type="submit">${newCity}</button></div>`);
                cityHistory.append(add);
            }
        } else {
            return;
        }
    })

}

async function getCityData() {
    let obj;
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
    obj = await res.json();
    result = obj.filter(ct => ct.country === 'US')
    return result;
}

async function convertCity() {
    var cityData = await getCityData();
    let obj;
    let data = [];

    const res = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityData[0].lat}&lon=${cityData[0].lon}&appid=${APIKey}`)

    obj = await res.json();


    let currentDate = moment().format("DD") - 1;
    obj.list.forEach((o) => {
        if (moment(o.dt_txt).format("DD") > currentDate) {
            currentDate = moment(o.dt_txt).format("DD");
            data.push(o);
        }
    })
    return data;
}

// Create 5 Day forcast cards
async function createWeekForcast() {
    var data = await convertCity();
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        var cardRow = $('#forcast-cards');
        var cardCol = $(`<div class="col"></div>`)
        var cardH = $(`<div class="card h-100"></div>`)
        var cardBody = $(`<div class="card-body"></div>`)
        let cDate = $(`<h5 class="card-title">${formatDate(data[i].dt_txt)}</h5>`)
        let cTemp = $(`<p class="card-text">Temp: ${data[i].main.temp} °F</p>`)
        let cWind = $(`<p class="card-text">Wind: ${data[i].wind.speed} MPH</p>`)
        let cHumidity = $(`<p class="card-text">Humidity: ${data[i].main.humidity}%</p>`)


        cardRow.append(cardCol);
        cardCol.append(cardH);
        cardH.append(cardBody)
        cardBody.append(cDate);
        // cardBody.appendChild(cIcon);
        cardBody.append(cTemp);
        cardBody.append(cWind);
        cardBody.append(cHumidity);
    }
}

// getForecastData();
// convertCity();
createWeekForcast();
addCityHistory();
// convertCity();