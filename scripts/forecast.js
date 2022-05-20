//calls to the weather api are included below:
const key = "gHXgxtVXTGc8G6r4xCeGgEAQPh4SelHN";
// get enpoint for city information
//return city
export const getCity = async(city)=>{
  const base = "http://dataservice.accuweather.com/locations/v1/cities/search";
  let query = `?apikey=${key}&q=${city}`;

  const response = await fetch(base + query); // this passes the reponse from the API server in the variable response
  const data = await response.json(); // once the promise is resolved, the data is converted to a JS object and stored within the data variable

  return data[0]; 
}

//get weather conditions endpoint using the data receive from the city request
//return weather conditions for specified area
export const getWeather = async (locationId)=>{
  const base ="http://dataservice.accuweather.com/currentconditions/v1/";
  const query = `${locationId}?apikey=${key}`;
  const response = await fetch(base + query); //await for the promise to be resolved before storing the response object
  const data = await response.json(); // await for the promise to be resolved( response object to be converted to a JavaScript object) before storing in the variable data
  
  return data[0]
}

//get hourly forecast for upcoming 12 hours
export const requestHourlyWeather = async(locationId)=>{
  const base ='http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/';
  const query = `${locationId}?apikey=${key}`;
  const response = await fetch(base + query);
  const data = await response.json();
  return data;

}







