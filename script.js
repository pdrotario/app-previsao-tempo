const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
var hasLoaded = new Boolean;

const apikey = '4f0c5f237b428cfe861db9dc06e5875a';
const geoAPIKey = '8cc70dc5f6b2465594d2a9ce1c343541';

const url = (city, key)=> `https://api.openweathermap.org/data/2.5/weather?q=
${city}&appid=${apikey}`;

var icon = document.getElementById("icon");
icon.onclick = function(){
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")){
        icon.src="img/sun.png";
    }else{
        icon.src="img/moon.png";
    }
}

function getUserPosition(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess,onError);
    }else{
        return;
    }
}

function onSuccess(position){
    let{latitude, longitude} = position.coords;
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}
    &key=${geoAPIKey}`).then(response => response.json().then(result => {
        let allDetails = result.results[0].components;
        let {city,state,country} = allDetails;
        getWeatherBycity(city);
    }));
}
function onError(){
    main.innerHTML="<p>Not possible to get your localization. Please, search for wanted city.</p>";
    hasLoaded=false;
    $(".loader").fadeOut(500);
}
getUserPosition();

async function getWeatherBycity(county){
    const resp = await fetch(url(county),{
    origin: "cors"});
    const respData = await resp.json();
    addWeatherToPage(respData);
    console.log(respData);
    hasLoaded=false;
}

function addWeatherToPage(data){
    const city = data.name;
    const country = data.sys.country;
    const temp=KtoC(data.main.temp);
    const tempMax = KtoC(data.main.temp_max);
    const tempMin = KtoC(data.main.temp_min);
    const feelLike = KtoC(data.main.feels_like);
    const weather = document.createElement("div");
    weather.classList.add('weather');
    weather.id = "weather";
    const titleCase = text=>{
        return text.toLowerCase().split(' ').map((word)=>{
            return word[0].toUpperCase() + word.slice(1);
        }).join(' ')
    }
    weather.innerHTML = `
        <h2><img class="icon-weather" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>${temp}°C</h2>
        <small>${tempMax}° / ${tempMin}°</small>
        <small>Feels like ${feelLike}°C</small>
        <p>in ${city}, ${country}</p>
    `;

    //Clean up
    main.innerHTML="";

    main.appendChild(weather);
    hasLoaded=true;
    load();
}


function KtoC(K){
    return Math.floor((K - 273.15));
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();

    const city = search.value;
    if(city){
        getWeatherBycity(city);
    }
});

function load(){
    if(!hasLoaded){
        document.getElementById('weather').style.display="none";
        $(".loader").fadeIn(1000);
    }else{
        document.getElementById('weather').style.display="block";
        $(".loader").fadeOut(1000);
        hasLoaded=true;
    }

   
}