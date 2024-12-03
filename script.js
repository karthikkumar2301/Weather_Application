const yourtab = document.querySelector(".your-weather");
const searchtab = document.querySelector(".search-weather");
const grantUI = document.querySelector(".grant-location");
const grantbtn = document.querySelector(".loc");
const loadingUI = document.querySelector(".loading");
const input_field = document.querySelector("[input-field]");
const searchbtn = document.querySelector("[btn-search]");
const weatherUI = document.querySelector(".user-info");
const searchform = document.querySelector("#search-tab");
const vid = document.querySelector(".src");
const video = document.querySelector(".vid");
const videox = document.querySelector(".vide");
const novideo = document.querySelector(".slash");
novideo.classList.add("remove");
const videobtn = document.querySelector("#videox");
const prop = {};
const api = "7a7c4cf5db010b3fec490f688f062f2b";
let currenttab = yourtab;
currenttab.classList.add("current-tab");
grantbtn.addEventListener('click', getlocation);
yourtab.addEventListener('click', () => { switchtab(yourtab); });
searchtab.addEventListener('click', () => { switchtab(searchtab); });
const err = document.querySelector(".error");

grantUI.classList.add("active");
searchform.classList.remove("active");
weatherUI.classList.remove("active");

function switchtab(clickedtab) {
    if (clickedtab !== currenttab) {
        currenttab.classList.remove("current-tab");
        currenttab = clickedtab;
        currenttab.classList.add("current-tab");


        video.classList.add("remove");
        weatherUI.classList.remove("active");
        searchform.classList.remove("active");
        videobtn.classList.remove("active");
        err.classList.remove("active");
        grantUI.classList.remove("active");


        if (clickedtab === yourtab) {

            grantUI.classList.add("active");
            sessionStorage.removeItem('user-coords');
        } else if (clickedtab === searchtab) {
            searchform.classList.add("active");
        }
    }
}


function getlocation() {

    sessionStorage.removeItem('user-coords');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(usercoords, handleLocationError);
    } else {
        alert('Location Permission Denied, Unable to detect Weather');
    }
}

function handleLocationError(error) {
    console.error("Error getting location", error);
    loadingUI.classList.remove("active");
    err.classList.add("active");
    grantUI.classList.remove("active");
}

function usercoords(position) {
    const coordinates = {
        lats: position.coords.latitude,
        long: position.coords.longitude,
    };
    sessionStorage.setItem('user-coords', JSON.stringify(coordinates));
    fetchuserweather(coordinates);
}

async function fetchuserweather(position) {
    const lat = position.lats;
    const lon = position.long;

    grantUI.classList.remove("active");
    weatherUI.classList.remove("active");
    loadingUI.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}&units=metric`);
        const data = await response.json();
        loadingUI.classList.remove("active");
        err.classList.remove("active");
        weatherUI.classList.add("active");
        videobtn.classList.add("active");
        renderinfo(data);
        Object.assign(prop, data);
    } catch {
        loadingUI.classList.remove("active");
        err.classList.add("active");
    }
}

function renderinfo(stats) {
    const cityname = document.querySelector("[city-name]");
    const countryicon = document.querySelector("[country-icon]");
    const weatherdes = document.querySelector("[weather-desc]");
    const weathericon = document.querySelector("[weather-icon]");
    const temp = document.querySelector("[temp]");
    const windspeed = document.querySelector("[windspeed]");
    const humidity = document.querySelector("[humidity]");
    const cloud = document.querySelector("[cloud]");

    cityname.innerText = stats?.name;
    countryicon.src = `https://flagcdn.com/144x108/${stats?.sys?.country.toLowerCase()}.png`;
    weatherdes.innerText = stats?.weather[0]?.description;
    weathericon.src = `https://openweathermap.org/img/wn/${stats?.weather[0]?.icon}.png`;
    temp.innerText = `${stats?.main?.temp} °C`;
    windspeed.innerText = `${stats?.wind?.speed}m/s`;
    humidity.innerText = `${stats?.main?.humidity}%`;
    cloud.innerText = `${stats?.clouds?.all}%`;

    const main = stats?.weather[0]?.main;
    bgchange(main);
}

function bgchange(main) {
    video.classList.remove("remove");
    if (main === "Clear") {
        vid.src = "video/clear.mp4";
        video.load();
    } else if (main === "Thunderstorm") {
        vid.src = "video/light.mp4";
        video.load();
    } else if (main === "Drizzle" || main === "Rain") {
        vid.src = "video/rain.mp4";
        video.load();
    } else if (main === "Snow") {
        vid.src = "video/snow.mp4";
        video.load();
    } else if (main === "Mist" || main === "Smoke" || main === "Haze" || main === "Dust" || main === "Fog" || main === "Sand" || main === "Ash" || main === "Squall" || main === "Tornado") {
        vid.src = "video/fog.mp4";
        video.load();
    } else if (main === "Clouds") {
        vid.src = "video/clouds.mp4";
        video.load();
    }
}

searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input_field.value == "") return;
    else fetchsearchweather(input_field.value);
});

async function fetchsearchweather(loc) {
    loadingUI.classList.add("active");
    weatherUI.classList.remove("active");
    videobtn.classList.remove("active");
    grantUI.classList.remove("active");

    err.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${api}&units=metric`);


        if (response.ok) {
            const data = await response.json();
            loadingUI.classList.remove("active");
            weatherUI.classList.add("active");
            videobtn.classList.add("active");
            renderinfo(data);
            Object.assign(prop, data);
        } else {

            throw new Error("City not found");
        }
    } catch (error) {
        loadingUI.classList.remove("active");
        err.classList.add("active");
    }
}


videobtn.addEventListener('click', () => {
    switchvideobtn();
});

function switchvideobtn() {
    if (novideo.classList.contains("remove")) {
        novideo.classList.remove("remove");
        videox.classList.add("remove");
        video.classList.add("remove");
    } else {
        novideo.classList.add("remove");
        videox.classList.remove("remove");
        video.classList.remove("remove");
    }
}

function gettimestr() {
    const d = new Date();
    const currhrs = d.getHours();
    if (currhrs < 12) {
        return "Good Morning";
    } else if (currhrs < 17) {
        return "Good Afternoon";
    } else {
        return "Good Evening";
    }
}
