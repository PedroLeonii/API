fetch("https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=36d53d5360cf4756940daa069b8acf46"
)
.then(response => {
        response.json().then(dati=>{
            console.log(dati);
    })
})
.catch(err => {
	console.log(err);
});