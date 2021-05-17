const apiKey = 'y3HnuYNUAqAbaf7rmLl9';
// https://api.winnipegtransit.com/v3/stops.json/10064?api-key=y3HnuYNUAqAbaf7rmLl9
// ttps://api.winnipegtransit.com/v3/streets/2715.json?api-key=y3HnuYNUAqAbaf7rmLl9&name=main%20street&type=st&leg=w&usage=long

let streetName = `main street`;
let array = streetName.split(' ');
streetName = array.join('%20');
console.log(streetName);
const streetURL = `https://api.winnipegtransit.com/v3/streets.json?api-key=${apiKey}&name=${streetName}&usage=long`;
console.log(streetURL);
fetch(streetURL)
.then( (data) => {return data.json()})
.then((datajson) => console.log(datajson));

// https://api.winnipegtransit.com/v3/stops/10064.json?api-key=y3HnuYNUAqAbaf7rmLl9&street=4499&usage=long
const streetKey = '4499';
// const stopURL = `https://api.winnipegtransit.com/v3/stops.json?api-key=y3HnuYNUAqAbaf7rmLl9&street=${streetKey}&usage=long`;
// https://api.winnipegtransit.com/v3/stops/10064/schedule.json?api-key=y3HnuYNUAqAbaf7rmLl9&max-results-per-route=2
// https://api.winnipegtransit.com/v3/stops/10185/schedule.json?api-key=y3HnuYNUAqAbaf7rmLl9&max-results-per-route=2
const stopURL = `https://api.winnipegtransit.com/v3/stops/4499/schedule.json?api-key=y3HnuYNUAqAbaf7rmLl9&usage=long&max-results-per-route=2`;
console.log(stopURL);

// fetch(streetURL)


// 1. street api
// https://api.winnipegtransit.com/v3/streets.json?api-key=y3HnuYNUAqAbaf7rmLl9&name=main

// 2. stop api
// https://api.winnipegtransit.com/v3/stops.json?api-key=y3HnuYNUAqAbaf7rmLl9&street=4499

// 3. stop schedule
// https://api.winnipegtransit.com/v3/stops/61151/schedule.json?api-key=y3HnuYNUAqAbaf7rmLl9