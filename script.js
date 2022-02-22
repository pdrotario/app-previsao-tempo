const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

const apikey = '4f0c5f237b428cfe861db9dc06e5875a';

const url = (city, key)=> `https://api.openweathermap.org/data/2.5/weather?q=
${city}&appid=${apikey}`;

async function getWeatherBycity(city){
    const resp = await fetch(url(city),{
    origin: "cors"});
    const respData = await resp.json();

    addWeatherToPage(respData);
    console.log(respData);
}

function addWeatherToPage(data){
    const temp=KtoC(data.main.temp);
    const tempMax = KtoC(data.main.temp_max);
    const tempMin = KtoC(data.main.temp_min);
    const weather = document.createElement("div");
    weather.classList.add('weather');
    const titleCase = text=>{
        return text.toLowerCase().split(' ').map((word)=>{
            return word[0].toUpperCase() + word.slice(1);
        }).join(' ')
    }

    weather.innerHTML = `
        <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>${temp}°C</h2>
        <small>Max: ${tempMax}°C Min: ${tempMin}°C</small>
        <small class="trn" id="text-to-translate">${data.weather[0].main}<small>
        <p>in ${titleCase(search.value)}</p>
    `;

    //Clean up
    main.innerHTML="";

    main.appendChild(weather);
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