async function getWeather() {
    var cityInput = document.getElementById("cityInput");
    var city = cityInput.value.trim();
    var resultBox = document.getElementById("weatherResult");
    var searchBtn = document.querySelector(".search-box button");

    if (city === "") {
        alert("请输入城市名称");
        return;
    }

    searchBtn.innerText = "查询中...";
    searchBtn.disabled = true;
    resultBox.style.display = "none";

    try {
        var geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1&language=zh&format=json";
        var geoResponse = await fetch(geoUrl);
        var geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            alert("未找到该城市，请尝试输入中文全称（如：北京）");
            searchBtn.innerText = "查询";
            searchBtn.disabled = false;
            return;
        }

        var location = geoData.results[0];
        var lat = location.latitude;
        var lon = location.longitude;
        var cityName = location.name;

        var weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";

        var weatherResponse = await fetch(weatherUrl);
        var weatherData = await weatherResponse.json();

        var current = weatherData.current;
        var temp = current.temperature_2m;
        var humidity = current.relative_humidity_2m;
        var windSpeed = current.wind_speed_10m;
        var weatherCode = current.weather_code;

        var weatherDesc = getWeatherDescription(weatherCode);

        document.getElementById("cityName").innerText = cityName;
        document.getElementById("temperature").innerText = Math.round(temp) + "°C";
        document.getElementById("weatherDesc").innerText = weatherDesc;
        document.getElementById("humidity").innerText = humidity + "%";
        document.getElementById("windSpeed").innerText = Math.round(windSpeed) + " km/h";

        resultBox.style.display = "block";

    } catch (error) {
        console.error(error);
        alert("获取天气信息失败，请检查网络连接");
    } finally {
        searchBtn.innerText = "查询";
        searchBtn.disabled = false;
    }
}

function getWeatherDescription(code) {
    var codes = {
        0: "晴朗",
        1: "主要晴朗",
        2: "多云",
        3: "阴天",
        45: "雾",
        48: "沉积雾凇",
        51: "毛毛雨",
        53: "中度毛毛雨",
        55: "大毛毛雨",
        61: "小雨",
        63: "中雨",
        65: "大雨",
        71: "小雪",
        73: "中雪",
        75: "大雪",
        95: "雷雨",
        96: "雷雨伴冰雹",
        99: "强雷雨伴冰雹"
    };
    return codes[code] || "未知天气";
}

document.getElementById("cityInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});