const apiKey = 'y3HnuYNUAqAbaf7rmLl9';
const inputForm = document.querySelector('form');
const streetsList = document.querySelector('.streets');
const stopsSchedule = document.querySelector('tbody');
const title = document.querySelector('#street-name');

const streetsListHTML = (streets) => {
  streetsList.innerHTML = '';
  streets.forEach(street => {
    streetsList.insertAdjacentHTML('beforeend',
    `<a href="#" data-street-key="${street.key}"
      >${street.name}</a>`
    );
  });
}

const searchStreets = async (streetName) => {
  let array = streetName.split(' ');
  streetName = array.join('%20');
  let streetURL = `https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${streetName}&usage=long`;
  const response = await fetch(streetURL);  
  const data = await response.json();

  if ( data.status === 404 ||data.status === 403|| data.streets.length === 0) {
    throw 'Street Not Found';
  }
  
  return data.streets;
}

const getAllStopKeys = async(streetKey) => {
  let stopsURL = `https://api.winnipegtransit.com/v3/stops.json?api-key=${apiKey}&street=${streetKey}`;
  const response = await fetch(stopsURL);  
  const data = await response.json();
  
  return data.stops;
}

const getStopsSchedule = async (stopsKey) => {
  let stopsScheduleURL = `https://api.winnipegtransit.com/v3/stops/${stopsKey}/schedule.json?api-key=${apiKey}&max-results-per-route=2`;

  const response = await fetch(stopsScheduleURL);  
  const data = await response.json();

  return data;
}

const timeCovert12h = (dateString) => {
  let date = new Date(dateString);
  let hour24 = date.getHours();
  let hour12 = hour24 % 12 || 12;
  let minute = date.getMinutes();
  let ampm = (hour24 < 12 || hour24 === 24) ? "AM" : "PM";
  
  return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}` ;
}

const scheduleListHTML = (schedules) => {
  stopsSchedule.innerHTML = '';
  
  schedules.forEach( schedule => {

    schedule['stop-schedule']['route-schedules'].forEach((data) => {
      data['scheduled-stops'].forEach((scheduleStop) => {

        // let date = new Date(scheduleStop.times.arrival.scheduled);

        stopsSchedule.insertAdjacentHTML('beforeend',
          `<tr>
            <td>${schedule['stop-schedule'].stop.name}</td>
            <td>${schedule['stop-schedule'].stop['cross-street'].name}</td>
            <td>${schedule['stop-schedule'].stop.direction}</td>
            <td>${scheduleStop.bus.key}</td>
            <td>${timeCovert12h(scheduleStop.times.arrival.scheduled)}</td>
          </tr>`
        );
      });
    });
  });
}

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchStreets(event.target[0].value)
  .then((date) => {
    return streetsListHTML(date);
  })
  .catch((err) => alert(err));
  event.target[0].value = '';
})

streetsList.addEventListener('click', (event) => {
  title.innerHTML = `Displaying results for ${event.target.closest('a').innerHTML}`
  getAllStopKeys(event.target.closest('a').dataset.streetKey)
  .catch(err => console.log(err))
  .then((allStops) => {
    const stopPromises = [];
    allStops.map((stop) => {
      stopPromises.push(getStopsSchedule(stop.key));
    });

    Promise.all(stopPromises)
    .then(value => {return scheduleListHTML(value)})
    .catch(err => alert("Fetch error! wait a minute!"));
  });
})