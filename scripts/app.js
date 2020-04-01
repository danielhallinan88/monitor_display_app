function add_zero_str(num) {
	if (num < 10) {
		num = "0" + num;
	}
	return num;
}
	
function getTime(){

	const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
	];

	const d = new Date(),
				month = monthNames[d.getMonth()],
				day = d.getDate(),
				year = d.getFullYear(),
	      seconds = add_zero_str(d.getSeconds()),
	      minutes = add_zero_str(d.getMinutes()),
	      hour = d.getHours();

	const span = document.getElementById('clock');

	span.innerHTML = `
	<h3>${month} ${day} ${year}</h3>
	<h2>${hour}:${minutes}:${seconds}</h2>
	`
	//span.textContent = hour + ":" + minutes + ":" + seconds;
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
		<h3>Currently: ${Math.round(currentTemp)}</h3>
		<h4>Today's High: ${Math.round(maxTemp)}</h4>
		<h4>Today's Low: ${Math.round(minTemp)}</h4>
		`.fontcolor('white');
	})
	.catch(function(err){
		console.log(err);
	});	
}

function formatDate(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (month < 10){
		month = `0${month}`;
	}

	if (day < 10){
		day = `0${day}`;
	}
	return `${date.getFullYear()}-${month}-${day}`
}

function findMinMax(weatherObj, future) {
	const items = weatherObj['list'];

	items.forEach(function(item){
		const day = item['dt_txt'].split(' ')[0];
		//console.log(day);
		if(future[day] !== undefined){
			//console.log(day);
			if(item['main']['temp_max'] > future[day]['hi']){
				future[day]['hi'] = item['main']['temp_max'];
			}

			if(item['main']['temp_min'] < future[day]['lo']){
				future[day]['lo'] = item['main']['temp_min'];
			}
		}
	});

	return future;
}

function getFutureWeather(weatherInfo){
	const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + weatherInfo["city"] + "&units=imperial&APPID=" + weatherInfo["apiId"];
	//console.log(url);
	
	fetch(url).then(function(res){
		return res.text();
	})
	.then(function(data){
		const weatherObj = JSON.parse(data);
		const tomorrowObj = weatherObj['list'][1];
		
		//console.log(weatherObj);

		let today = new Date();
		let day2 = new Date(today);
		let day3 = new Date(day2);
		let day4 = new Date(day3);
		let day5 = new Date(day4);
		day2.setDate(day2.getDate() + 1);
		day3.setDate(day3.getDate() + 2);
		day4.setDate(day4.getDate() + 3);
		day5.setDate(day5.getDate() + 4);
		today = formatDate(today);
		day2 = formatDate(day2);
		day3 = formatDate(day3);
		day4 = formatDate(day4);
		day5 = formatDate(day5);

		let future = {
			[day2] : {
				hi : 0,
				lo : 999
			},
			[day3] : {
				hi : 0,
				lo : 999
			},
			[day4] : {
				hi : 0,
				lo : 999
			},
			[day5] : {
				hi : 0,
				lo : 999
			},
		}

		future = findMinMax(weatherObj, future);
		//console.log(future);

		let futureWeather = '';

		for (const day in future) {
			const hi = Math.round(future[day]["hi"]);
			const lo = Math.round(future[day]["lo"]);
			const line = `<h4>${day}: ${hi}/${lo}</h4>`;
			//console.log(line);
			futureWeather += line;
		}

		//console.log(futureWeather);
		document.getElementById("future_temp").innerHTML = futureWeather.fontcolor('white');

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
				const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        items.forEach(function(item){
					//console.log(item);
					const status = item.status;
					const today = new Date();
					//console.log(status);

					if(status == "confirmed") {
						
						const dateTime = item.start.dateTime;
						const eventDate = new Date(dateTime);
						//console.log(dateObj);

						if(eventDate > today){
							const summary = item.summary;
							const date = dateTime.split('T')[0];
							const time = `${eventDate.getHours()}:${(eventDate.getMinutes()<10?'0':'') + eventDate.getMinutes()}`;
							const dayName = dayNames[eventDate.getDay()];
							const line = `${dayName} ${date} ${time}, ${summary}`;
							//console.log(line);
							const pItem = document.createElement("h4");
							pItem.innerText = line;
							pItem.classList.add("event-item");
							pItem.style.marginLeft = "1em";
							parent.style.color = "white";
							parent.appendChild(pItem);
						}

					}
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