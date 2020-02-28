var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}
navigator.geolocation.getCurrentPosition(success,error,options)

function success(position){
    
}
function error(er){
    console.log("ERROR CODE: "+er.code+"    ERROR TYPE: "+er.message);
}
