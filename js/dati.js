window.onload = ()=>{    
   var forecastWeek = document.getElementById("forecastWeek");

    function getForecastGeoloc(){    
        return new Promise((resolve,reject)=>{navigator.geolocation.getCurrentPosition(resolve,reject)})
    }

    function requestForecas(lon,lat){
        return fetch("https://api.weatherbit.io/v2.0/forecast/daily?&lat="+lat+"&lon="+lon+"&key=36d53d5360cf4756940daa069b8acf46")
    }

    function Init(){
        getForecastGeoloc().then((position)=>{
            requestForecas(position.coords.longitude,position.coords.latitude).then(response => {
                if(response.ok){
                    response.json().then((date)=>{
                        console.log(date)
                        setForecastOut(date,outputDaily,outputWeek);
                    })
                }
                else{
                    
                }
            })
        })
    }
    function setForecastOut(date,...parentNodes){

    }
    Init()
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