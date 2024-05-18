const iconElement = document.querySelector('.weather-icon')
const locationIcon = document.querySelector('.location-icon')
const tempElement = document.querySelector('.temperature-value p')
const descElement = document.querySelector('.temperature-description p')
const locationElement = document.querySelector('.location p')
const notificationElement = document.querySelector('.notification')

var input = document.getElementById('search')


let city = ''
let latitude = 0.0
let longitude = 0.0

input.addEventListener('keyup', function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        city = input.value;
        console.log("City : ",city);
        getWeatherCity(city)
    }
})

const weather = {}

weather.temperature={
    unit: 'celsius'
}

const KELVIN = 273
const key = 'c22809c7d81cb9c6d18e51ec95246a28'
if('geolocation' in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError)
}else{
    notificationElement.computedStyleMap.display = "block";
    notificationElement.innerHTML = '<p>Browser doesnt support location.</p>'
}

function setPosition(position){
    latitude = position.coords.latitude
    longitude = position.coords.longitude
}

function showError(error){
    notificationElement.style.display = 'block'
    notificationElement.innerHTML = `<p>${error.message}</p>`
}

locationIcon.addEventListener('click', function(event){
    console.log("clicked");
    getWeather(latitude, longitude)
})



function getWeather(latitude, longitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`
    fetch(api).then(function(response){
        let data = response.json()
        console.log(data)
        return data
    })
    .then(function(data){
        weather.temperature.value = Math.floor(data.main.temp) - KELVIN
        weather.description = data.weather[0].description
        weather.iconId = data.weather[0].icon
        weather.city = data.name
        weather.country = data.sys.country
    })
    .then(function(){
        display()
    })
}

function getWeatherCity(city){
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    fetch(api).then(function(response){
        let data = response.json()
        console.log(data)
        return data
    })
    .then(function(data){
        console.log(data)
        if(data.cod==="404"){
            weather.message = data.message
            weather.city = city
            input.value = weather.city
            notificationElement.style.display = 'block'
            notificationElement.innerHTML = `<p>${data.message}</p>`
            return
        }else{
            console.log(data)
            weather.temperature.value = Math.floor(data.main.temp) - KELVIN
            weather.description = data.weather[0].description
            weather.iconId = data.weather[0].icon
            weather.city = data.name
            weather.message = ''
            weather.country = data.sys.country
            display()
        }
    })
}

function display(){
    iconElement.innerHTML = `<img src='icons/${weather.iconId}.png'/>`
    tempElement.innerHTML = `${weather.temperature.value}* <span>C</span>`
    input.value = weather.city
    descElement.innerHTML = weather.description
    
    locationElement.innerHTML = `${weather.city}, ${weather.country}`
    notificationElement.style.display = 'block'
}