const app = document.querySelector(".weather-app");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");


// Default City when the page Loads
let cityInput = "London";

// Add click event to each city in the panel
cities.forEach((city)=> {
    city.addEventListener('click',(e)=> {
        //change from default city to the clicked one 
        cityInput = e.target.innerHTML;
        // function that fetches and displays all the data from the weather Api 
        fetchWeatherData();
        // fade out the app (simple animation)
        app.style.opacity= "0";
    })
})

// Add submit event to the form
form.addEventListener('submit', (e)=> {
    // if the input field (search bar)
    // is empty , throw on alert
    if(search.value.length == 0 ){
        alert('please type in a city name');
    } else{
        // change From default city to the 
        // one written in the input field
        cityInput= search.value;
            // function that fetches and displays all the data from the weather Api 
            fetchWeatherData();
            //Remove all text from the input field
            search.value = '';
            // fade out the app (simple animation)
            app.style.opacity="0";
    }
    // prevents the default behavior of the form
    e.preventDefault();
});

// function that returns a day of the week (monday , Tuesday,friday..)from a date (12 05 2023)
// we will use this function later 

function dayOfTheWeek(day, month, year){
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    var d = new Date(day,month,year)
    var dayName = weekday[d.getDay()];
    return dayName;
    // return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};
  // function that fetches and displays all the data from the weather Api 
 function fetchWeatherData(){
    //  Fetch the data and dynamicaly add
    // the city name with template Literals
    // Use Your own Key
    fetch(`https://api.weatherapi.com/v1/current.json?key=96cde8af630d468ca92192553231205&q=${cityInput}`)
    // Take the data (which is in JSON format)
    // and convert it to a regular Js object 
    .then(response => response.json())
    .then(data => {
        // You can console Log the data to see what is available
        console.log(data);

        // lets start by adding the temperature
        // and weather condition to the page
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        // get the data and time from the city and extract the day , month ,year and time into invididual variables
        const date = data.location.localtime;
        const y = parseInt(date.substr(0,4));
        const m = parseInt(date.substr(5,2));
        const d = parseInt(date.substr(8,2));
        const time = date.substr(11);

        // Reformat the data into Something more appealing and add it to the page .
        // Original format: 2023-05-13 01;17
        // New format :01;17 -Saturday 13, 05 2023
        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;
        
        // Add the name of the city into the page
        nameOutput.innerHTML= data.location.name;

        // Get the correspanding icon url for the weather and extract a part of it
        const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
        // Reformat the icon url to your own local folder path and add it to the page.
        icon.src="./icons/" + iconId;

        // Add the weather details to the page
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        // Set default time of day
        let timeOfDay = 'day';
        // Get the unique id for each weather condition
        const code = data.current.condition.code;

        // change to night if its night time  in the city
        if(!data.current.is_day){
            timeOfDay = "night";
        }
        if(code == 1000) {
            // set the background image to
            // clear if the weather is clear
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/clear.jpg)`;
            // change the button bg color depending on if its day or night
            btn.style.background = "#e5ba92";
            if(timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }
           // Something for cloudy weather
        else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282 
        ) {
            app.style.backgroundImage =`
            url(./images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background ="#fa6d1b";
            if(timeOfDay =="night"){
                btn.style.background ="#181e27";
            }
            // Add Rain
        }else if (
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1053 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252 
        ) {
            app.style.background = `
            url(./images${timeOfDay}/rainy.jpg)`;
            btn.style.background ="#647d75";
            if(timeOfDay =="night"){
                btn.style.background ="#325c80";
            }
            // and finally snow
        } else{
            app.style.backgroundImage = `
            url(./images/${timeOfDay}/snow.jpg)`;
            if(timeOfDay == "night") {
                btn.style.background ="#1b1b1b";
            }
        }
        // fade in the page once all is done
        app.style.opacity='1';
    })
    // if the user types a city that doesn't exist,
    // throw on alert.
    .catch(()=> {
        alert('City not found , please try again');
        app.style.opacity ="1";
    });
 }
// call the function on page load 
 fetchWeatherData();
//  fade in the page
app.style.opacity ="1";
