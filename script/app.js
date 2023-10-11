const searchForm = document.querySelector("#searchform");
const weatherMainContainer = document.querySelector(".weather-app");
const cityInput = searchForm.querySelector("#city"); 
const weatherStateIcon = document.querySelector("#weather-state-icon");
const weatherMainCelsius = document.querySelector(".weather-state-celcius");
const weatherLoction = document.querySelector(".weather-state-location");
const weatherSunset = document.querySelector(".weather-current-time");
const weatherDate = document.querySelector(".weather-current-name");
const placeholderMainInfo = document.querySelector(".placeholder-main-info");
const humidity = document.querySelector(".humidity");
const uv = document.querySelector(".uv");
const sunset = document.querySelector(".sunset");
const sunrise = document.querySelector(".sunrise");
const airPressure = document.querySelector(".air-pressure");
const windArrow = document.querySelector(".wind-arrow");
const map = document.querySelector("#map");
const toggleTheme = document.querySelector(".light-and-dark-toggle");
const circle = document.querySelector(".circle");
const ctx = document.getElementById('myChart');
const dayInfo = document.querySelector(".day-info");


const API_KEY = "644f6ce0ca9e401ebb891832211707";

document.addEventListener("DOMContentLoaded", loadWeatherData);
searchForm.addEventListener("submit", loadWeatherData)
toggleTheme.addEventListener("click", toggleDarkAndLightmode)


function toggleDarkAndLightmode(){
    circle.classList.toggle("toggle-active");
    if(localStorage.getItem("theme") == "dark"){
        localStorage.setItem("theme", "light");
        weatherMainContainer.classList.remove("darkmode")
        circle.firstElementChild.style.display = "block";
        circle.lastElementChild.style.display = "none";
    }
    else{
        localStorage.setItem("theme", "dark")
        weatherMainContainer.classList.add("darkmode")
        circle.firstElementChild.style.display = "none";
        circle.lastElementChild.style.display = "block";
    }
};


(() => {
    if(localStorage.getItem("theme") == "dark"){
        circle.lastElementChild.style.display = "block";
        circle.firstElementChild.style.display = "none";
        circle.classList.add("toggle-active");
        weatherMainContainer.classList.add("darkmode")
    }
    else{
        circle.lastElementChild.style.display = "none";
        circle.firstElementChild.style.display = "block";
        circle.classList.remove("toggle-active");
        weatherMainContainer.classList.remove("darkmode")
    }
})()



async function loadWeatherData(e){
    e.preventDefault()
    try{
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityInput.value ? cityInput.value : "Tashkent"}&days=7&aqi=yes&alerts=yes`);
        let data = await response.json();
        renderWeatherData(data)
        cityInput.value = ""
    }catch(error){
        console.log(error)
    }
}

function renderWeatherData(weatherData){
    if(false){
        placeholderMainInfo.style.display = "block"
    }
    else{
        renderChart(weatherData);
        weatherStateIcon.src = weatherData.current.condition.icon;
        weatherMainCelsius.innerText = weatherData.current.temp_c + "°";
        weatherLoction.innerText = `${weatherData.location.country}, ${weatherData.location.name}`;
        weatherSunset.innerText = weatherData.forecast.forecastday[0].astro.sunset;
        weatherDate.innerText = `Sunset Time, ${identifyTheWeekDay(new Date().getDay())}`;
        humidity.innerText = weatherData.current.humidity + "%";
        uv.innerText = weatherData.current.uv + " out of 10";
        sunset.innerText = weatherData.forecast.forecastday[0].astro.sunset
        sunrise.innerText = weatherData.forecast.forecastday[0].astro.sunrise
        airPressure.innerHTML = weatherData.current.pressure_mb + "Pa";
        windArrow.style.transform = `rotate(${weatherData.current.wind_degree}deg)`;
        const daysFragment = document.createDocumentFragment();
        dayInfo.innerHTML = ""
        weatherData.forecast.forecastday.forEach(day => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h4>${identifyTheWeekDay(+new Date(day.date).getDay()).slice(0, 3).toUpperCase()}</h4>
                <img  src="${day.day.condition.icon}"/>
                <p>${day.day.avgtemp_c}°</p>
            `
            daysFragment.appendChild(div)
        })
        dayInfo.appendChild(daysFragment);
        map.src = `https://maps.google.com/maps?q=${weatherData.location.name}%20Dates%10Products&amp;t=&amp;z=12&amp&output=embed`
        weatherStateIcon.style.display = "block";
        weatherMainCelsius.style.display = "block";
        weatherLoction.style.display = "block";
    }
}
   

function identifyTheWeekDay(time){
    switch(time){
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday"
        default:
            return "Sunday"
    }
}


function renderChart(weatherData){
    let temps = weatherData.forecast.forecastday[0].hour.map(item => item.temp_c)
    let hours = weatherData.forecast.forecastday[0].hour.map(item => item.time.split(" ")[1]);
    document.querySelector(".chart-wrapper").innerHTML = '<canvas id="myChart"></canvas>';
    var ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
        labels: hours,
        datasets: [{
            label:  `Weather data for ${weatherData.location.name}`,
            data: temps,
            borderWidth: 3,
            borderColor: "blueviolet",
            backgroundColor: "#fff"
        }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                      display: false
                    },
                    ticks: {
                        font: {
                            size: 16,
                        }
                    }
                  },
                  y: {
                    grid: {
                      display: false
                    }
                  }
            }
        }
    });
}