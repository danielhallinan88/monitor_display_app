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
	
	const url = "https://api.openweathermap.org/data/2.5/weather?q=" + weatherInfo["city"] + "&units=imperial&APPID=" + weatherInfo["apiId"];
	
	fetch(url).then(function(res){
		return res.text();
	})
	.then(function(data){
		const weatherObj = JSON.parse(data);
		
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
	const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherInfo["city"] + "&units=imperial&APPID=" + weatherInfo["apiId"];
	//console.log(url);
	
	fetch(url).then(function(res){
		return res.text();
	})
	.then(function(data){
		const weatherObj = JSON.parse(data);
		const tomorrowObj  = weatherObj['list'][1];
		
		//console.log(weatherObj);
		//console.log(tomorrowObj);
		
		const tomorrowTemp = tomorrowObj['main']['temp'],
		    tomorrowMinTemp = tomorrowObj['main']['temp_min'],
			tomorrowMaxTemp = tomorrowObj['main']['temp_max'];
		
		document.getElementById("tomorrow_temp").innerHTML = `
		<h3>Tomorrow: ${tomorrowTemp}</h3>
		<h4>Tomorrow's High: ${tomorrowMaxTemp}</h4>
		<h4>Tomorrow's Low: ${tomorrowMinTemp}</h4>
		`.fontcolor('white');
	})
	.catch(function(err){
		console.log(err);
	});		
}

function getWeather(data) {
	const weatherInfo = data.weather;
	getCurrentWeather(weatherInfo);
	getFutureWeather(weatherInfo);
}

function authenticate(SCOPES) {
	return gapi.auth2.getAuthInstance()
			.signIn({scope: SCOPES})
			.then(function() { console.log("Sign-in successful"); },
						function(err) { console.error("Error signing in", err); });
}

function loadClient(API_KEY, CALENDAR, DISCOVERY_DOCS) {
	gapi.client.setApiKey(API_KEY);
	return gapi.client.load(DISCOVERY_DOCS)
			.then(function() { console.log("GAPI client loaded for API");
													execute(CALENDAR); },
						function(err) { console.error("Error loading GAPI client for API", err); });
}

// Make sure the client is loaded and sign-in is complete before calling this method.
function execute(CALENDAR) {

  return gapi.client.calendar.events.list({
    "calendarId": CALENDAR
  })
      .then(function(response) {
        // Handle the results here (response.result has the parsed body).
				const items = response.result.items;
				const parent = document.getElementById('schedule');

        items.forEach(function(item){
          const summary = item.summary,
                start = item.start.dateTime,
                end = item.start.dateTime;

          const line = `${summary} : ${start} - ${end}`;
          //console.log(line);
          const listItem = document.createElement("li");
          listItem.innerText = line;
					parent.appendChild(listItem);
					parent.style.color = "white";
        });

        //console.log("Response", response);
                    
      },
      function(err) { console.error("Execute error", err); });
}

function getCalendar(data) {
	google = data.google;
	const CLIENT_ID = google.clientId,
				API_KEY = google.apiKey,
				CALENDAR = google.calendarId;
				DISCOVERY_DOCS = google.discoveryDocs;
				SCOPES = google.scopes;

	gapi.load("client:auth2", function() {
		gapi.auth2.init({client_id: CLIENT_ID});
	});
	
	window.onload = function() {
		authenticate(SCOPES);
		loadClient(API_KEY, CALENDAR, DISCOVERY_DOCS);
	};	
}

// App INIT
const dataObj = JSON.parse(data);
//console.log(dataObj);

setInterval(getTime, 1000);
getTime();
getWeather(dataObj);
getCalendar(dataObj);