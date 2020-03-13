function add_zero_str(num) {
	if (num < 10) {
		num = "0" + num;
	}
	return num;
}
	
function getTime(){

	const span = document.getElementById('clock');

	const d = new Date(),
	      s = add_zero_str(d.getSeconds()),
	      m = add_zero_str(d.getMinutes()),
	      h = d.getHours();

	span.textContent = h + ":" + m + ":" + s;
}

function getCurrentWeather(weatherInfo){
	
	const url = "https://api.openweathermap.org/data/2.5/weather?q=" + weatherInfo["City"] + "&units=imperial&APPID=" + weatherInfo["apiId"];
	
	fetch(url).then(function(res){
		return res.text();
	})
	.then(function(data){
		const weatherObj = JSON.parse(data);
		
		//console.log(weatherObj);
		
		const currentTemp = weatherObj['main']['temp'],
		      minTemp = weatherObj['main']['temp_min'],
			  maxTemp = weatherObj['main']['temp_max'];
		
		document.getElementById("current_temp").innerHTML = `
		<h3>Currently: ${currentTemp}</h3>
		<h4>Today's High: ${maxTemp}</h4>
		<h4>Today's Low: ${minTemp}</h4>
		`.fontcolor('white');
	})
	.catch(function(err){
		console.log(err);
	});	
}

function getFutureWeather(weatherInfo){
	const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherInfo["City"] + "&units=imperial&APPID=" + weatherInfo["apiId"];
	console.log(url);
	
	fetch(url).then(function(res){
		return res.text();
	})
	.then(function(data){
		const weatherObj = JSON.parse(data);
		const tomorrowObj  = weatherObj['list'][1];
		
		console.log(weatherObj);
		console.log(tomorrowObj);
		
		const tomorrowTemp = tomorrowObj['main']['temp'],
		    tomorrowMinTemp = tomorrowObj['main']['temp_min'],
			tomorrowMaxTemp = tomorrowObj['main']['temp_max'];
		
		document.getElementById("tomorrow_temp").innerHTML = `
		<h3>Tomorrow: ${tomorrowTemp}</h3>
		<h4>Today's High: ${tomorrowMaxTemp}</h4>
		<h4>Today's Low: ${tomorrowMinTemp}</h4>
		`.fontcolor('white');
	})
	.catch(function(err){
		console.log(err);
	});		
}

function getWeather() {
	const weatherInfo = JSON.parse(weather);
	getCurrentWeather(weatherInfo);
	getFutureWeather(weatherInfo);
}

setInterval(getTime, 1000);
getTime();
getWeather();