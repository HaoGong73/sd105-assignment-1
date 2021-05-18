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

  console.log(data);

  if ( data.status === 404 ||data.status === 403|| data.streets.length === 0) {
    throw 'Street Not Found';
  }
  
  return data.streets;
}

const getAllStopKeys = async(streetKey) => {
  let stopsURL = `https://api.winnipegtransit.com/v3/stops.json?api-key=${apiKey}&street=${streetKey}`;
  console.log(stopsURL);
  const response = await fetch(stopsURL);  
  const data = await response.json();

  console.log(data.stops);
  
  return data.stops;
}

const getStopsSchedule = async (stopsKey) => {
  let stopsScheduleURL = `https://api.winnipegtransit.com/v3/stops/${stopsKey}/schedule.json?api-key=${apiKey}&max-results-per-route=2`;
  console.log(stopsScheduleURL);

  const response = await fetch(stopsScheduleURL);  
  const data = await response.json();

  console.log(data);
  
  return data;
}

const scheduleListHTML = (schedules) => {
  stopsSchedule.innerHTML = '';
  
  schedules.forEach( schedule => {

    schedule['stop-schedule']['route-schedules'].forEach((data) => {
      console.log(data);
      data['scheduled-stops'].forEach((scheduleStop) => {
        console.log(schedule['stop-schedule'].stop.name);
        console.log(schedule['stop-schedule'].stop['cross-street'].name);
        console.log(schedule['stop-schedule'].stop.direction);
        console.log(scheduleStop.bus.key);

        let date = new Date(scheduleStop.times.arrival.scheduled);

        stopsSchedule.insertAdjacentHTML('beforeend',
          `<tr>
            <td>${schedule['stop-schedule'].stop.name}</td>
            <td>${schedule['stop-schedule'].stop['cross-street'].name}</td>
            <td>${schedule['stop-schedule'].stop.direction}</td>
            <td>${scheduleStop.bus.key}</td>
            <td>${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}</td>
          </tr>`
        );
      });
    });
  });
}

inputForm.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log(event.target[0].value);
  searchStreets(event.target[0].value)
  .then((date) => {
    return streetsListHTML(date);
  })
  .catch((err) => alert(err));
  event.target[0].value = '';
})

streetsList.addEventListener('click', (event) => {
  console.log(event.target.closest('a').dataset.streetKey);
  title.innerHTML = `Displaying results for ${event.target.closest('a').innerHTML}`
  getAllStopKeys(event.target.closest('a').dataset.streetKey)
  .then((allStops) => {
    const stopPromises = [];
    allStops.map((stop) => {
      stopPromises.push(getStopsSchedule(stop.key));
    })
    .catch(err => console.log(err));
    Promise.all(stopPromises).then(value => scheduleListHTML(value))
    .catch(err => console.log(err));
  });
})