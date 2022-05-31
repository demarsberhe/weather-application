import {getCity, getWeather, requestHourlyWeather} from "./forecast.js";
//var moment = require('moment');
//DOM elements stored in variables
const cityField = document.querySelector('.change-location'); //form -> user input city
const card = document.querySelector('.card'); //container for all weather content
const details = document.querySelector('.details'); //temperature, city, weather condition
const time = document.querySelector('.time'); // day/night image
const icon = document.querySelector('.icon img'); //weather condition icon 

//convert military to standard time
const convertTime = inputTime=>{
  let intTime = parseInt(inputTime); //this returns the military time as an int
  let standardTime;
  if(intTime > 12){
    let outputTime = intTime - 12;
    standardTime = outputTime +':00' +' P.M.';
  } else if(intTime ===0){
    standardTime = '12:00 A.M';

  } else{
    standardTime = intTime + ':00'+ ' A.M.';
  }
  return standardTime;
}

const updateCity = async(city)=>{//this function will return a promise
 const cityDetails = await getCity(city); //returns a promise once the getCity information is retrieved from the API, once resolved, the promise is stored in the variable cityDetails
 const weather = await getWeather(cityDetails.Key); //returns a promise once the weather information is retrieved from the API for the specified city, once resolved, the promise is stored in the variable weather
 const hourlyWeather = await requestHourlyWeather(cityDetails.Key); //returns a promise once the 12 hour weather information is retrieved from the API for the specified city, once resolved, the promise is stored in the variable hourlyWeather
 return { 
   cityDetails: cityDetails,
   weather: weather,
   hourlyWeather: hourlyWeather

 }

}
cityField.addEventListener('submit', e=>{
  //prevent default action  -> this ensures that the page is not refreshed
  e.preventDefault();

  //get city value
  const city = cityField.city.value.trim();// this retrieve the value entered by the user in the input field named "city" and trims and leading or trailing whitespace
  cityField.reset(); 

  //update the ui with the new city
  updateCity(city)
  .then(data=>{ //data = values returned { cityDetails: cityDetails,weather: weather} 
    updateUI(data); //this passes the data = values returned { cityDetails: cityDetails,weather: weather, hourlyWeather: hourlyWeather} through the updateCity() function
 
  })
  .catch(err=>{
    console.log(err);
  })

});

//function will update the DOM with data retrieved from the API
const updateUI = (data)=>{
  const hourlyWeather = data.hourlyWeather;
  const cityDetails = data.cityDetails;
  const weather = data.weather;


  //remove display-none class to allow for the remainder of the card to display
  if(card.classList.contains('d-none')){
    card.classList.remove('d-none');
  };

   //displays day/night image depending on if it is daytime
  let timeSrc = weather.IsDayTime ? 'img/day.svg': 'img/night.svg';
 
  time.setAttribute('src',timeSrc);
  time.setAttribute('alt', 'image of the current time of day');

  const iconNum = data.weather.WeatherIcon;
  icon.setAttribute('src', `img/icons/${iconNum}.svg`);
  icon.setAttribute('alt','image of the current weather outside');

    //update HTML
    details.innerHTML = ` 
    <h5 class="my-3">${cityDetails.EnglishName}</h5>
     
    <div class="my-3">${weather.WeatherText}</div>
     
    <div class="display-4 my-4">
  
      <span>${weather.Temperature.Imperial.Value}</span>
      <span>&deg;F</span>
    </div>`;

  //loop to iterate through all hourly elements and update content per hour
    for(let i=1; i<13; i++){
      let time = convertTime(hourlyWeather[i-1].DateTime.substr(11,12).substr(0,6));
      document.getElementById(`hour-${i}`).innerHTML = 
      `<span>${time}</span>
      <span>${hourlyWeather[i-1].IconPhrase}</span>
      <img src="img/icons/${hourlyWeather[i-1].WeatherIcon}.svg" alt="image of weather conditions"><img>
      <span>${hourlyWeather[i-1].Temperature.Value}</span>
      <span>&deg;F</span>`;
    }
    
}

document.getElementById('hourlyWeatherButton').addEventListener('click', ()=>{
  document.getElementById('collapseHourlyData').classList.toggle('collapse');
})