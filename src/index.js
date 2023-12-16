function formatDate(date) {
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
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
  
    return `${day} ${hours}:${minutes}`;
  }
  let cityInput;
  let apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let units = "metric";
  let apiUrl;
  
  function displayWeather(response) {
    //let cityElement = response.data.name;
    //cityInput = document.querySelector("#city");
    //cityInput.innerHTML = cityElement;
  
    document.querySelector("#city").innerHTML = response.data.name;
  
    let temperature = Math.round(response.data.main.temp);
    let tempSpan = document.querySelector("#temperature");
    tempSpan.innerHTML = temperature;
  
    let humidityLi = response.data.main.humidity;
    let hum = document.querySelector("#humidity");
    hum.innerHTML = humidityLi + " %";
  
    let wind = Math.round(response.data.wind.speed);
    let windLi = document.querySelector("#wind");
    windLi.innerHTML = wind + " km/h";
  
    let weather = response.data.weather[0].description;
    let weatherLi = document.querySelector("#weather");
    weatherLi.innerHTML = weather;
  }
  
  function search(event) {
    event.preventDefault();
    let searchCity = document.querySelector("#search-form-input");
    let dateElement = document.querySelector("#date");
    let currentTime = new Date();
    dateElement.innerHTML = formatDate(currentTime);
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity.value}&appid=${apiKey}&units=${units}`;
  
    axios.get(apiUrl).then(displayWeather);
  
    axios
      .get(apiUrl)
      .then(function (response) {
        displayWeather(response);
      })
      .catch(function (error) {
        alert("This city doesn't exist!", error);
      });
  }
  let searchForm = document.querySelector("#search-form");
  searchForm.addEventListener("submit", search);
  
  getCurrentPosition();
  
  function getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  
  function showPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`;
  
    axios
      .get(apiUrl)
      .then(function (response) {
        displayWeather(response);
  
        // Adiciona a data ao elemento com id "date"
        let dateElement = document.querySelector("#date");
        let currentTime = new Date();
        dateElement.innerHTML = formatDate(currentTime);
      })
      .catch(function (error) {
        console.error("Erro na chamada da API:", error);
      });
  }
  
  let button = document.querySelector("#current-location-button");
  button.addEventListener("click", getCurrentPosition);
  