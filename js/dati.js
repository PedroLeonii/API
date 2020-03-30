class DlForecast{

    constructor(_date, _temp, _maxTemp, _minTemp, _windDir, _windSpd, _imgCode, _description, _cityName, _country){
     
        this.date = _date;
        this.temp = _temp + "°";
        this.maxTemp = _maxTemp + "°";
        this.minTemp = _minTemp + "°";
        this.windDir = _windDir;
        this.windSpd = _windSpd+"m/s";
        this.imgF = "https://www.weatherbit.io/static/img/icons/" + _imgCode + ".png";
        this.city = _cityName ;
        this.country = _country;
        this.description = _description;
    }

    getCookieObj(){
        return this.cookieObj = {city: this.city , country: this.country}
    }
    
    static searchMinTemp(forecast){
        var minTemp = Number.MAX_VALUE;
        try{
            forecast.forEach((day=>{
                if (day.minTemp < minTemp) {
                    minTemp = day.minTemp;
                }
            }))
            return minTemp;
        }
        catch(e){
            console.log(e);
            return -1;
        }
    }
    
    static searchDayF(forecast,dayQ){
        
        for (let i = 0; i < forecast.length; i++) {
            if (forecast[i].date === dayQ) {
                return forecast[i];
            }
            
        }
        return null;
     
    }

    static searchMaxTemp(forecast){
        var maxTemp = Number.MIN_VALUE;
        try{
            forecast.forEach((day=>{
                if (day.maxTemp > maxTemp) {
                    maxTemp = day.maxTemp;
                }
            }))
            return maxTemp;
        }
        catch(e){
            console.log(e);
            return -1;
        }
    }
}

window.onload = ()=>{    
    
    var daySlider = 0;
    var btnSearch = document.getElementById("search");
    var inCity = document.getElementById("cityIn");
    var fcstGeo = [];
    var fcstQuery = [];
    var loading = document.getElementById("loading");
    var fcstGeoDiv= document.getElementById("forecastG");
    var fcstQueryDiv = document.getElementById("forecastQ");
    var btnPrev = document.getElementById("previous");
    var btnNext = document.getElementById("next");
    var star = document.getElementById("star");
  

    
//forecast geolocalizzazione
    
    getPosition();

// bottone favoriti
    var preferiti = JSON.parse("["+getFavourites()+"]");
    var btnPref = document.getElementById("favourites")

    preferiti.forEach( loc =>{
        var nodo = document.createElement("button");
        nodo.setAttribute("class","btn bt-primary btn-block");
        nodo.setAttribute("id","fav")
        btnPref.appendChild(nodo);
        document.getElementById("fav").value = loc.city + loc.country;
        document.getElementById("fav").addEventListener("click",reqQuery)
    })

//bottone forecast query

    btnSearch.addEventListener("click",reqQuery);

//impostazioni preferiti
    star.addEventListener("click",setCookie)
    
//gestione preferiti ==> cookies

    function setCookie(){
        
        var location = fcstQuery[0].getCookieObj();
        var preferiti = JSON.parse("["+getFavourites()+"]");
        var duration = new Date();
        duration.setHours("23");
        var name = "preferiti";

        if (document.cookie === "") {
            document.cookie = name + "="+ JSON.stringify(location) +";expires = " + duration.toUTCString()+', path=/';
        } else {
            if (contains(preferiti,location)) { 

                document.cookie = name + "=" + getFavourites() + "," + JSON.stringify(location)  + ";expires = " + duration.toUTCString() + ', path=/';   
            }
            else{
                window.alert("location: " + location.city + " is already saved as favourite")
            }
        }
       
            
    }

    function contains(locations, loc){
        for (let index = 0; index < locations.length; index++) {
            if (locations[index].city == loc.city && locations[index].country == loc.country){
                return false;
            }
        }
        return true;
    }

    function getFavourites(){
        var cookie = document.cookie;
        var favourites = cookie.substr(cookie.indexOf("=")+1 ,cookie.length);
        return favourites;

    } 

//geolocalizzazione + fetch

    function getPosition(){   
        navigator.geolocation.getCurrentPosition(requestG,errorG);
    }
    function errorG(e){
        loading.innerHTML = "<h6>Error message: " + e.message + "</h6>";
    }

    function requestG(position){

        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        
        
        fetch("https://api.weatherbit.io/v2.0/forecast/daily?&lat=" + lat + "&lon=" + lon + "&key=36d53d5360cf4756940daa069b8acf46")
            .then(response => {
                if (response.ok) {

                    return response.json();
                }
                else {
                    
                    loading.innerHTML = "<h6>Error message: " + response.message + "</h6>";
                    
                }
            })
            .then((results) => {
    
                results.data.forEach((dailyF) => {

                    fcstGeo.push(new DlForecast(String(dailyF.valid_date).split("-").reverse().join("/"), dailyF.temp, dailyF.max_temp, dailyF.min_temp, dailyF.wind_cdir,
                        dailyF.wind_spd.toPrecision(3), dailyF.weather.icon, dailyF.weather.description, results.city_name, results.country_code));

                });
                
                setForecastOut(fcstGeoDiv);

                setTimeout(() => {

                    loading.style.display = "none";
                    fcstGeoDiv.style.removeProperty("display");

                }, 1000);

                btnNext.addEventListener("click", () => {

                    if (daySlider < fcstGeo.length-1) {
                        daySlider++;
                        setForecastOut(fcstGeoDiv);
                    }
                })

                btnPrev.addEventListener("click", () => {

                    if (daySlider > 0) {
                        daySlider--;
                        setForecastOut(fcstGeoDiv);
                    }
                })
                
            })


    } 

    //fetch con query utente

    function reqQuery(){

        city = inCity.value;
        country = document.getElementById("countryIn").value.toUpperCase();   
        dayIn = document.getElementById("dateQ").value.split("-").reverse().join("/");
        
        if(fcstQuery.length === 0 || (fcstQuery[0].city !== city || fcstQuery[0].country !== country)){
            fcstQuery = [];
            fetch("https://api.weatherbit.io/v2.0/forecast/daily?city="+city+"&country="+country+"&key=36d53d5360cf4756940daa069b8acf46")
            .then((response)=>{
                
                if(response.ok){
                    return response.json();
                }
                else{
                    console.log("Bad request")
                }
            })
            .then((results)=>{
                console.log(results)
                results.data.forEach((dailyF) => {

                    fcstQuery.push(new DlForecast(String(dailyF.valid_date).split("-").reverse().join("/"), dailyF.temp, dailyF.max_temp, dailyF.min_temp, dailyF.wind_cdir,
                    dailyF.wind_spd.toPrecision(3), dailyF.weather.icon, dailyF.weather.description, results.city_name, results.country_code));
                    
                });
                setForecastOut(fcstQueryDiv,dayIn);
            })   
        }
        else{
            setForecastOut(fcstQueryDiv,dayIn);
        }
        
    }

    //funzione output dati

    function setForecastOut(parentDiv,day){

        var ids = "#"+Object.keys(fcstGeo[daySlider]).join(" ,#");
        var elements = parentDiv.querySelectorAll(ids);

        if (day === undefined) {
            elements.forEach(element => {
                var value = fcstGeo[daySlider][element.id];
                if(element.id === "imgF"){
                    element.src = value;
                }
                else{
                    element.innerHTML = value;
                }    
            }); 

        } else {
            
            var forecast = DlForecast.searchDayF(fcstQuery,day);
            if (forecast !== null) {
                if (document.getElementById("alertD") !== null) {
                    document.getElementById("alertD").remove();
                }
                elements.forEach(element => {
                    var value = forecast[element.id];
                    if(element.id === "imgF"){
                
                        element.src = value;
                    }
                    else{
                        element.innerHTML = value;
                    }
                    fcstQueryDiv.style.removeProperty("display");    
                }); 
            } else {
                if (document.getElementById("alertD") === null) {

                    var alert = document.createElement("p");
                    var text = document.createTextNode("input date is not valid");
                    alert.id = "alertD";
                    alert.appendChild(text);
        
                    document.getElementById("inRow").before(alert);

                }

            }
            
           
        }
    }

}