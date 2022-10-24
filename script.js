// API key
var APIKey = '0921cf8315a06211d5c903665ccab12f';

// DOM Elements
var cityHistory = $('#city-history');
var mainCard = $('#main-card')
var cardRow = $('#forcast-cards');


// Utilities
function formatDate(date) {
    return `${moment(date).format("M")}/${moment(date).format("DD")}/${moment(date).format("YYYY")}`
}
function clearDivs() {
    mainCard.empty();
    cardRow.empty();
}


// API Call Variables
var searchBtn = $("#search").on("click", async () => {
    var city = $("#city-input").val();
    let cityData;
    let obj;
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
    obj = await res.json();
    cityData = obj.filter(ct => ct.country === 'US');

    // Take the converted data from Geocoder API and pass to forcast API
    let objRes;
    let data = [];
    const resData = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityData[0].lat}&lon=${cityData[0].lon}&units=imperial&appid=${APIKey}`)
    objRes = await resData.json();
    let currentDate = moment().format("DD") - 1;
    objRes.list.forEach((o) => {
        if (moment(o.dt_txt).format("DD") > currentDate) {
            currentDate = moment(o.dt_txt).format("DD");
            data.push(o);
        }
    })

    // Call function to render HTML on page with data
    createWeekForcast(data, objRes.city.name);
    addCityHistory(city)
});



function renderHistory() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith("ls-")) {
            var con = localStorage.getItem(localStorage.key(i))
            var add = $(`<div class=" m-1 row"><button id="ls-${con}" class="btn btn-secondary btn-block" type="submit">${con}</button></div>`).on("click", async (event) => {
                let city = event.target.innerHTML;
                let cityData;
                let obj;
                const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
                obj = await res.json();
                cityData = obj.filter(ct => ct.country === 'US');

                // Take the converted data from Geocoder API and pass to forcast API
                let objRes;
                let data = [];
                const resData = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityData[0].lat}&lon=${cityData[0].lon}&units=imperial&appid=${APIKey}`)
                objRes = await resData.json();
                let currentDate = moment().format("DD") - 1;
                objRes.list.forEach((o) => {
                    if (moment(o.dt_txt).format("DD") > currentDate) {
                        currentDate = moment(o.dt_txt).format("DD");
                        data.push(o);
                    }
                })

                // Call function to render HTML on page with data
                createWeekForcast(data, objRes.city.name);
            });
            cityHistory.append(add)
        }

    }
}

// Function that adds search history to local storage after api call and creates button
function addCityHistory(newCity) {
    if (newCity.length > 0) {
        if (Object.keys(localStorage).includes(`ls-${newCity}`)) {
            return;
        } else {
            localStorage.setItem(`ls-${newCity}`, newCity)
            const add = $(`<div class=" m-1 row"><button id="ls-${newCity}" class="btn btn-secondary btn-block" type="submit">${newCity}</button></div>`).on("click", async (event) => {
                let city = event.target.innerHTML;
                let cityData;
                let obj;
                const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
                obj = await res.json();
                cityData = obj.filter(ct => ct.country === 'US');

                // Take the converted data from Geocoder API and pass to forcast API
                let objRes;
                let data = [];
                const resData = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${cityData[0].lat}&lon=${cityData[0].lon}&units=imperial&appid=${APIKey}`)
                objRes = await resData.json();
                let currentDate = moment().format("DD") - 1;
                objRes.list.forEach((o) => {
                    if (moment(o.dt_txt).format("DD") > currentDate) {
                        currentDate = moment(o.dt_txt).format("DD");
                        data.push(o);
                    }
                })

                // Call function to render HTML on page with data
                createWeekForcast(data, objRes.city.name);
            });
            cityHistory.append(add);
        }
    }
    $("#city-input").val('');
}


// Create 5 Day forcast cards
function createWeekForcast(data, cityName) {

    // Empty the divs before rendering
    clearDivs();

    // Create elements for current day card
    var mainCardDate = $(`<h3 class="card-title">${cityName} ${formatDate(data[0].dt_txt)} <img src="http://openweathermap.org/img/wn/${data[0].weather[0].icon}@2x.png"/></h3>`);
    var mainCardTemp = $(`<p class="card-text">Temp: ${data[0].main.temp} °F</p>`);
    var mainCardWind = $(`<p class="card-text">Wind: ${data[0].wind.speed} MPH</p>`);
    var mainCardHumidity = $(`<p class="card-text">Humidity: ${data[0].main.humidity}%</p>`);

    // Connect elements 
    mainCard.append(mainCardDate);
    mainCard.append(mainCardTemp);
    mainCard.append(mainCardWind);
    mainCard.append(mainCardHumidity);

    // Create elements for 5 day forecast cards
    for (var i = 1; i < data.length; i++) {
        var cardCol = $(`<div class="col"></div>`)
        var cardH = $(`<div class="card h-90 bg-dark text-white"></div>`)
        var cardBody = $(`<div class="card-body"></div>`)
        let cDate = $(`<h5 class="card-title">${formatDate(data[i].dt_txt)}</h5>`)
        let cIcon = $(`<img src="http://openweathermap.org/img/wn/${data[i].weather[0].icon}@2x.png"/>`)
        let cTemp = $(`<p class="card-text">Temp: ${data[i].main.temp} °F</p>`)
        let cWind = $(`<p class="card-text">Wind: ${data[i].wind.speed} MPH</p>`)
        let cHumidity = $(`<p class="card-text">Humidity: ${data[i].main.humidity}%</p>`)

        // Connect elements
        cardRow.append(cardCol);
        cardCol.append(cardH);
        cardH.append(cardBody)
        cardBody.append(cDate);
        cardBody.append(cIcon);
        cardBody.append(cTemp);
        cardBody.append(cWind);
        cardBody.append(cHumidity);
    }
}

renderHistory();