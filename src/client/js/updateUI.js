export const updateUI = (trip, data) => {
    let element = document.getElementById('forcast_details');
    if (element != null){
        element.remove();
    }

    // remove banner and display trip card
    document.getElementById('banner').style.display = "none";
    document.getElementById('section2').style.display = "flex";

    // update card fields: title (city and country), img, time to departure
    document.getElementById("dest_city").innerHTML = data.city + ", ";
    document.getElementById("dest_country").innerHTML = trip.trip.country;
    document.getElementById('output_img2').src = trip.trip.imgURL;
    document.getElementById("depart_info").innerHTML = trip.trip.departureInfo;

    // update weather forcast: termprature. For all dates
    let temp = `Weather forcast ${trip.trip.tempMin} - ${trip.trip.tempMax} °C`
    document.getElementById("day_temp").innerHTML = temp;

    // update weather forcast: icon + details. Applies for 16 days only
    if (trip.trip.diffDays >=0 && trip.trip.diffDays < 16){
        // create <div> element
        let div = document.createElement('div');
        div.setAttribute('id', 'forcast_details');
        
        // create sub elements and fill with info (weather description, icon)
        let p = document.createElement('p');
        p.textContent = trip.trip.weatherDescription;
        p.setAttribute('id', 'day_desc');
        let img = document.createElement('img');
        img.setAttribute('id', 'weather_icon');
        let icon_src = `https://www.weatherbit.io/static/img/icons/${trip.trip.icon}.png`;
        img.src = icon_src;

        // append <p> <img> to the div
        div.appendChild(p);
        div.appendChild(img);

        // append <div> to the dome
        document.querySelector('#forcast').appendChild(div);
    }
}