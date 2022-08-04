let currentDateinfo = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

let months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
];

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

let year = currentDateinfo.getFullYear();
let month = months[currentDateinfo.getMonth()];
let daynumber = currentDateinfo.getDate();
let dayname = days[currentDateinfo.getDay()];
let hours = currentDateinfo.getHours();
if (hours < 10) {
  hours = `0${hours}`;
}
let minutes = currentDateinfo.getMinutes();
if (minutes < 10) {
  minutes = `0${minutes}`;
}
let dateToday = document.querySelector("#dayTime");
dateToday.innerHTML = `${daynumber}.${month}.${year} <div> ${dayname} ${hours}:${minutes} </div>`;

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "bcd3d2fbc24c8350e07ae42ef3638942";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showWeatherCond(response) {
  console.log(response.data);
  document.querySelector("#cityName").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  celciusTemperature = response.data.main.temp;

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#pressure").innerHTML = Math.round(
    response.data.main.pressure
  );
  document.querySelector("#feels_like").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "bcd3d2fbc24c8350e07ae42ef3638942";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherCond);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

let cityName = document.querySelector("#search-form");
cityName.addEventListener("submit", searchCity);

let celciusTemperature = null;

function changeToF(event) {
  event.preventDefault();
  let fTemp = (celciusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#temperature");
  cLink.classList.remove("active");
  fLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(fTemp);
}

function changeToC(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  cLink.classList.add("active");
  fLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

let fLink = document.querySelector("#f-link");
fLink.addEventListener("click", changeToF);

let cLink = document.querySelector("#c-link");
cLink.addEventListener("click", changeToC);

function searchLocation(position) {
  let apiKey = "bcd3d2fbc24c8350e07ae42ef3638942";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeatherCond);
  console.log(apiUrl);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `   

<div class=" col-2 weather-forecast" id="forecast"> 
<div> 
    <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
  <img src="http://openweathermap.org/img/wn/${
    forecastDay.weather[0].icon
  }@2x.png" class="weather_pic" alt="warm"> 
</div> 
<div class="weather-forecast-temperatures">
<span class="weather-forecast-temperature-max"> ${Math.round(
          forecastDay.temp.max
        )}° </span>
<span class="weather-forecast-temperature-min"> ${Math.round(
          forecastDay.temp.min
        )}° </span>
</div>
<div>Warm</div>
</div>

`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

searchCity("Kyiv");
