import api_key from '../config.mjs';


const timeE1=document.getElementById('time');
const dateE1= document.getElementById('date');
const timezone=document.getElementById('time-zone');
const country_name=document.getElementById('country');
const currentWeatherE1=document.getElementById('currentTemp');
const humidity= document.getElementById('humidity');
const pressure= document.getElementById('pressure');
const wind_speed= document.getElementById('wind speed');
const sunrise= document.getElementById('sunrise');
const sunset= document.getElementById('sunset');
const weatherForecast=document.getElementById('weather-forecast');



const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months=['Jan','Feb','March','April','May','June','July','Aug','Sept','Oct','Nov','Dec'];
setInterval(()=>{
    const time= new Date();
    const month= time.getMonth();
    const date= time.getDate();
    const day= time.getDay();
    const hour= time.getHours();
    const hoursIn12HrsFormat= hour>=13? hour%12: hour;
    const minutes= time.getMinutes();
    const ampm= hour>=12? 'PM' : 'AM';

    timeE1.innerHTML=(hoursIn12HrsFormat<10? '0'+ hoursIn12HrsFormat:hoursIn12HrsFormat ) + ':' + (minutes<10? '0'+minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateE1.innerHTML= days[day] +', ' + date + ' '+ months[month];

},1000);


function getWeatherDataForDays(){
    navigator.geolocation.getCurrentPosition((success)=>{
        let{latitude, longitude}= success.coords;
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${latitude},${longitude}&days=7`).then(res=>res.json()).then(data=>{
            let sunrise_data=(data.forecast.forecastday[0].astro.sunrise);
            let sunset_data=(data.forecast.forecastday[0].astro.sunset);
            sunrise.innerHTML=`<div id="sunrise">${sunrise_data}</div>`;
            sunset.innerHTML=`<div id="sunset">${sunset_data}</div>`;

            console.log(data);

            let currentWeather=(data.current.temp_c);
            let humidityE=(data.current.humidity);
            let pressure_in= (data.current.pressure_in);
            let wind_kph=(data.current.wind_mph);
            let time_zone=data.location.tz_id;
            let Country=data.location.country;
            humidity.innerHTML=`<div id="humidity">${humidityE} %</div>`;
            pressure.innerHTML=`<div id="pressure">${pressure_in} %</div>`;
            wind_speed.innerHTML=`<div id="wind speed">${wind_kph} %</div>`;
            currentWeatherE1.innerHTML=`<div class="current-temp" id="currentTemp">${currentWeather}&#176; C</div>`;
            timezone.innerHTML=`<div class="time-zone" id="time-zone">${time_zone}</div>`;
            country_name.innerHTML=`<div class="country" id="country">${Country}</div>`;


          
                let forecastHTML = ''; // Create a variable to store the forecast HTML

                for (var i = 0; i < data.forecast.forecastday.length; i++) {
                    let dayCondition = data.forecast.forecastday[i].day.condition.text;
                    let dayTemp = data.forecast.forecastday[i].day.avgtemp_c;
                    let dailyImg = data.forecast.forecastday[i].day.condition.icon;
                    console.log(dayCondition);
                    console.log(dayTemp);
                    console.log(dailyImg);

                    forecastHTML += `
                        <div class="weather-forecast-items">
                        
                            <div class="day">${window.moment(data.forecast.forecastday[i].date_epoch * 1000).format('ddd')}</div>
                            <img src="${dailyImg}" class="w-icon">
                            <div class="temp">${dayTemp}&#176; C</div>
                            <div class="condition">${dayCondition}</div>
                           
                        </div>`;
                }

                // Update the forecast inside the "weather-forecast" div
            weatherForecast.innerHTML = forecastHTML;

        }
        )
    })
}
getWeatherDataForDays();


