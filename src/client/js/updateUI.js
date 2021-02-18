export const updateUI = (trip, data) => {
    let element = document.getElementById('forcast_details');
    if (element != null){
        element.remove();
    }

    document.getElementById('banner').style.display = "none";
    document.getElementById('section2').style.display = "flex";

    document.getElementById("dest_city").innerHTML = data.city + ", ";
    document.getElementById("dest_country").innerHTML = trip.trip.country;
    document.getElementById('output_img2').src = trip.trip.imgURL;
    document.getElementById("depart_info").innerHTML = trip.trip.departureInfo;

    let temp = `Weather forecast ${trip.trip.tempMin} - ${trip.trip.tempMax} °C`
    document.getElementById("day_temp").innerHTML = temp;

    if (trip.trip.diffDays >=0 && trip.trip.diffDays < 16){
        // create <div> element
        let div = document.createElement('div');
        div.setAttribute('id', 'forcast_details');
        
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