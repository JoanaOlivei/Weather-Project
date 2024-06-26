let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
let units = "metric";
let apiUrl;

function displayWeather(response) {
  const weatherData = response.data;

if (weatherData.daily) {
    const today = weatherData.daily[0];
    document.querySelector("#city").innerHTML = weatherData.name;

    const weather = today.weather[0].description;
    const weatherLi = document.querySelector("#weather");
    weatherLi.innerHTML = weather.charAt(0).toUpperCase() + weather.slice(1);

    const localTime = new Date(today.dt * 1000 + weatherData.timezone_offset * 1000);
    const dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(localTime);

    const humidityLi = today.humidity;
    const hum = document.querySelector("#humidity");
    hum.innerHTML = "<strong>Humidity:</strong> " + humidityLi + " %";

    const wind = Math.round(today.wind_speed);
    const windLi = document.querySelector("#wind");
    windLi.innerHTML = "<strong>Wind:</strong> " + wind + " km/h";

    const temperature = Math.round(today.temp.day);
    const tempSpan = document.querySelector("#temperature");
    tempSpan.innerHTML = temperature + "<label class='units'>°C</label>";

    const weatherIcon = today.weather[0].icon;
    const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
    const weatherIconElement = document.querySelector("#weather-icon");
    weatherIconElement.innerHTML = `<img src="${weatherIconUrl}" alt="Weather Icon" width= 88 height= 88 >`;
  }else{
    document.querySelector("#city").innerHTML = weatherData.name;

    const weather = weatherData.weather[0].description;
    const weatherLi = document.querySelector("#weather");
    weatherLi.innerHTML = weather.charAt(0).toUpperCase() + weather.slice(1);

    const humidityLi = weatherData.main.humidity;
    const hum = document.querySelector("#humidity");
    hum.innerHTML = "<strong>Humidity:</strong> " + humidityLi + " %";

    const wind = Math.round(weatherData.wind.speed);
    const windLi = document.querySelector("#wind");
    windLi.innerHTML = "<strong>Wind:</strong> " + wind + " km/h";

    const temperature = Math.round(weatherData.main.temp);
    const tempSpan = document.querySelector("#temperature");
    tempSpan.innerHTML = temperature + "<label class='units'>°C</label>";

    const forecastNull = document.querySelector("#forecast");
    //forecastNull.innerHTML = "";

    const weatherIcon = weatherData.weather[0].icon;
    const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
    const weatherIconElement = document.querySelector("#weather-icon");
    weatherIconElement.innerHTML = `<img src="${weatherIconUrl}" alt="Weather Icon" width= 88 height= 88 >`;

  }

}

function search(event) {
  event.preventDefault();
  let searchCity = document.querySelector("#search-form-input").value;
  
  if (!searchCity) {
    alert("Please enter a city name.");
    return;
  }

  apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl)
    .then(function (response) {
      displayWeather(response);
      const cityForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=${units}`;

      axios.get(cityForecastUrl)
        .then(function (forecastResponse) {
          displayForecast(forecastResponse);
          document.querySelector("#search-form-input").value = "";
        })
        .catch(function (error) {
          console.error("Error fetching city forecast data:", error);
          alert("Failed to fetch city forecast data. Please try again later.");
        });
    })
    .catch(function (error) {
      if (error.response && error.response.status === 404) {
        alert("City not found. Please enter a valid city name.");
      } else {
        alert("Failed to fetch weather data. Please try again later.");
        console.error("Error fetching weather data:", error);
      }
    });
}


function formatDate(timestamp) {
  let date = new Date(timestamp); 

  let hours = date.getHours() + 1;
  if (hours < 10) {
    hours = `0${hours}`;
  }
  
  let dateMinutes = new Date();
  let minutes = dateMinutes.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  return ` ${day} ${hours}:${minutes}`;
}

function formatDay(timestamp){
  let date = new Date(timestamp); 
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];
  return ` ${day}`;
}

getCurrentPosition();

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", search);

function showPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${apiKey}&units=${units}`;

  // Chamada para obter dados atuais da cidade
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl)
    .then(function (weatherResponse) {
      displayWeather(weatherResponse);

      axios.get(currentWeatherUrl)
        .then(function (currentWeatherResponse) {
          const cityName = currentWeatherResponse.data.name;

          document.querySelector("#city").innerHTML = cityName;
          axios.get(apiUrl)
            .then(displayForecast)
            .catch(function (error) {
              console.error("Error fetching forecast data", error);
              alert("Error fetching forecast data. Check the console for details.");
            });
        })
        .catch(function (error) {
          console.error("Error fetching current weather data", error);
        });
    })
    .catch(function (error) {
      console.error("Error fetching weather data", error);
      alert("Error fetching weather data. Check the console for details.");
    });
}

function displayForecast(response) {
  const forecastData = response.data;

  if (forecastData && forecastData.daily) {
    let forecastHtml = "<div class='row' >";

    forecastData.daily.slice(1, 6).forEach(function (day) {
      // Note que agora estamos usando .slice(1, 6) para obter os próximos 5 dias, excluindo o atual.

      forecastHtml +=
        `
          <div class="weather-forecast-day">
            <div class="weather-forecast-date">${formatDay(day.dt * 1000)}</div>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" class="weather-forecast-icon" />
            <div class="weather-forecast-temperatures">
              <div class="weather-forecast-temperature">
                <strong>${Math.round(day.temp.max)}º</strong>
              </div>
              <div class="weather-forecast-temperature">${Math.round(day.temp.min)}º</div>
            </div>
          </div>
        `;
    });

    forecastHtml += "</div>";

    const forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = forecastHtml;
  } else {
    console.error("Invalid forecast data structure.");
  }
}
