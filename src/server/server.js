var path = require('path');
const express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();
let trip = {};

const app = express()


app.use(express.static('dist'))


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(cors());

app.listen(8088, function () {
    console.log(' app listening on port 8088!')
})



// Function that sends a request to Geonames server 

const Country = async (geonamesKEY) => {
    const response = await fetch(`http://api.geonames.org/searchJSON?username=${geonamesKEY}&q=${trip.city}&maxRows=1`);
    try {
        const data = await response.json();
        trip.country = data.geonames[0].countryName;
    } catch (error) {
        trip.country = "Error, country does not exist";
        cosole.log("error");
    }
}

// Function that sends a request to Pixabay server

const Image = async (pixKEY) => {
    const response = await fetch(`https://pixabay.com/api/?image_type=photo&key=${pixKEY}&q=${trip.city}`);
    try {
        const data = await response.json();
        trip.imgURL = data.hits[0].webformatURL;
    } catch (error) {
        console.log("error");
    }
}

// Function that sends a request to Pixabay server 

const Weather = async (weatherbitsKEY, url) => {
    const response = await fetch(`${url}&key=${weatherbitsKEY}&units=M&city=${trip.city},${trip.country}`);
    try {
        const data = await response.json();
        
        if (trip.diffDays >= 0 && trip.diffDays < 16){
            trip.tempMin = data.data[trip.diffDays].low_temp;
            trip.tempMax = data.data[trip.diffDays].high_temp;
            trip.icon = data.data[trip.diffDays].weather.icon;
            trip.weatherDescription = data.data[trip.diffDays].weather.description
            }
        else {
            trip.tempMin = data.data[0].min_temp;
            trip.tempMax = data.data[0].max_temp;           
        }

    } catch (error) {
        trip.weather = "error";
    }
}


// function that calculates number of days between today and departure date 
function departureInfo(date) {
    const today = new Date();
    const departure = new Date(date);
    const diffTime = Math.abs(departure - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    trip.diffDays = diffDays;

    const diffDaysManual = departure.getDate() - today.getDate();
    const diffYears = departure.getFullYear() - today.getFullYear();
    const diffMonths = ((departure.getMonth() + 1) - (today.getMonth() + 1));


    if (diffDaysManual == 0 && diffYears == 0 && diffMonths == 0){
        trip.departureInfo = `Trip is today ${departure.getDate()}.${(departure.getMonth() + 1)}.${departure.getFullYear()}`;
        trip.diffDays = 0;
    }
    else if (diffDaysManual == -1 && diffYears == 0 && diffMonths == 0){
        trip.departureInfo = `Trip was yesterday ${departure.getDate()}.${(departure.getMonth() + 1)}.${departure.getFullYear()}`;
        trip.diffDays *= -1;
    }
    else if (diffDaysManual == 1 && diffYears == 0 && diffMonths == 0){
        trip.departureInfo = `Trip is tomorrow ${departure.getDate()}.${(departure.getMonth() + 1)}.${departure.getFullYear()}`;
    }
    else if ((departure - today) > 0){
        trip.departureInfo = `Trip is in ${diffDays} days on ${departure.getDate()}.${(departure.getMonth() + 1)}.${departure.getFullYear()}`;
    }
    else{
        trip.departureInfo = `Trip was ${diffDays} days ago on ${departure.getDate()}.${(departure.getMonth() + 1)}.${departure.getFullYear()}`;
        trip.diffDays *= -1;
    }
}



// endpoint to get main page
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})


function getWeatherbitURL(diffDays, userInputDate){
    // change date format for YY MM DD data extraction
    const departure = new Date(userInputDate);
    
    let url = "";
    if (diffDays < 0 ){
        let startDate = `${departure.getFullYear()}-${departure.getMonth() + 1}-${departure.getDate()}`;
        let endDate =  `${departure.getFullYear()}-${departure.getMonth() + 1}-${departure.getDate() + 1}`;
        url = `http://api.weatherbit.io/v2.0/history/daily?start_date=${startDate}&end_date=${endDate}`;
    }
    else if (diffDays > 15){
        let startDate = `2019-${departure.getMonth() + 1}-${departure.getDate()}`;
        let endDate =  `2019-${departure.getMonth() + 1}-${departure.getDate() + 1}`;
        url = `http://api.weatherbit.io/v2.0/history/daily?start_date=${startDate}&end_date=${endDate}`;
    }
    // for 16days forcast use different url (here we get icons)
    else {
        url = `http://api.weatherbit.io/v2.0/forecast/daily?`;
    }
    return url;
}


app.post('/trip', async(req, res) => {
    // reset current trip
    trip = {};
    try {
        trip.city = req.body.city;
        let departureDate = req.body.departure;
        
        departureInfo(departureDate);

        let url = getWeatherbitURL(trip.diffDays, departureDate);
        
        await Image(process.env.API_KEY_PIXABAY);
        await Country(process.env.API_KEY_GEONAMES);
        await Weather(process.env.API_KEY_WEATHERBIT, url);
        res.json({
            success: true, 
            trip: trip
        });
    } catch (error) {
        res.send({success: false});
    }
     
})

module.exports = app