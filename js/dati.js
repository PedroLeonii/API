class DlForecast{

    constructor(_date, _temp, _maxTemp, _minTemp, _windDir, _windSpd, _imgCode, _description, _cityName, _country){
     
        this.date = _date;
        this.temp = _temp;
        this.maxTemp = _maxTemp;
        this.minTemp = _minTemp;
        this.windDir = _windDir;
        this.windSpd = _windSpd;
        this.imgF = "https://www.weatherbit.io/static/img/icons/" + _imgCode + ".png";
        this.location = _cityName + " " + _country;
        this.description = _description;
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
    var inCity = document.getElementById("query");
    var fcstGeo = [];
    var fcstQuery = [];
    var loading = document.getElementById("loading");
    var  fcstGeoDiv= document.getElementById("forecastG");
    var fcstQueryDiv = document.getElementById("forecastQ");
    var btnPrev = document.getElementById("previous");
    var btnNext = document.getElementById("next");

    
    function btnValue(){
        btnPrev.addEventListener("mouseover",()=>{
            btnPrev.innerHTML = "<h3> < </h3>"
        })
        btnPrev.addEventListener("mouseleave",()=>{
            btnPrev.innerHTML = ""
        })
    
        btnNext.addEventListener("mouseover",()=>{
            btnNext.innerHTML = "<h3> > </h3>"
        })
        btnNext.addEventListener("mouseleave",()=>{
            btnNext.innerHTML = ""
        })
    }

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
                    btnValue();

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
    getPosition();
    function reqQuery(){
        var query = inCity.value;
        fetch("https://api.weatherbit.io/v2.0/forecast/daily?city="+query+"&key=36d53d5360cf4756940daa069b8acf46")
        .then((response)=>{
            if(response.ok){
                return response.json();
            }
            else{
                
            }
        })
        .then((forecast)=>{
            
        })
    }

    btnSearch.addEventListener("click",reqQuery);
    function setForecastOut(parentDiv){
        
        var ids = "#"+Object.keys(fcstGeo[daySlider]).join(" ,#");
        var elements = parentDiv.querySelectorAll(ids);
        
      
        
        elements.forEach(element => {
            var value = fcstGeo[daySlider][element.id];
            if(element.id === "imgF"){
                element.src = value;
            }
            else{
                element.innerHTML = value;
            }    
        });

    }   
}