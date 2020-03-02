window.onload = ()=>{    
    var daySlider = 0;
    var dati;
    const ids = ["valid_date","temp","max_temp","min_temp","wind_cdir_full","wind_spd"];
    var loading = document.getElementById("loading");
    var forecastWeek = document.getElementById("forecastWeek");
    var btPrev = document.getElementById("previous");
    var btNext = document.getElementById("next");

    function getForecastGeoloc(){    
        return new Promise((resolve,reject)=>{navigator.geolocation.getCurrentPosition(resolve,reject)})
    }

    function requestForecas(lon,lat){
        return fetch("https://api.weatherbit.io/v2.0/forecast/daily?&lat="+lat+"&lon="+lon+"&key=36d53d5360cf4756940daa069b8acf46")
    }

    function outForecast(){
        
        return new Promise((resolve,reject)=>{
            getForecastGeoloc().then((position) => {
                return requestForecas(position.coords.longitude, position.coords.latitude)
            
            }).catch((e)=>{
                reject(e);
            })
            .then(response => {
                
                if (response.ok) {
                    return response.json();
                }
                else {

                } 
                        
                    
            }).then((data) => {
                dati = data;
                resolve();
            })
        })
    }
    
    function setForecastOut(info){
        var location = document.getElementById("location");
        var description = document.getElementById("description");
        var imageW = document.getElementById("whetherImg");

        description.innerHTML = info.data[daySlider].weather.description;
        imageW.setAttribute("src","https://www.weatherbit.io/static/img/icons/"+info.data[daySlider].weather.icon+".png")
        location.innerHTML = info.city_name +" "+ info.country_code;
        
        ids.forEach(id => {
            var output = document.getElementById(id);
            var testo = info.data[daySlider][id];
            output.innerHTML = testo;
        });

    }
    function init(){
        
            outForecast().then(()=>{
                setForecastOut(dati);
                setTimeout(()=>{
                    loading.style.display = "none";
                    forecastWeek.style.removeProperty("display");    
                },1000);
                btNext.addEventListener("click",()=>{
                    if(daySlider < 7){
                        daySlider++;
                        setForecastOut(dati);
                    }  
                })
            
                btPrev.addEventListener("click",()=>{
                    if(daySlider > 0){
                       daySlider--;
                       setForecastOut(dati);
                    }  
                })
            }).catch((e)=>{
                loading.innerHTML = "<h6>abilitate the geolocation to view the forecast of your current position</h6>";
                
            })
    }
    init();
}

/* requestForecas(position.coords.longitude,position.coords.latitude).then(response => {
    if(response.ok){
        response.json().then(dati=>{
            resolve(dati)
        })
    }
    else{
        reject(response)
    }
}) */