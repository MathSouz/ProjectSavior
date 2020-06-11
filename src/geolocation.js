function initGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const urlToFetch = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&result_type=country&key=AIzaSyBhn4Mv4O19lb5rthedXmBhbmlmMJ7YHek`;

            fetch(urlToFetch, { method: 'get' })
                .then((response) => {
                    response.json().then((data) => {
                        console.log(data.results[0].formatted_address);
                    })
                })
                .catch((err) => {
                    console.log(err);

                })
        })
    }

    else {
        console.error('Não há suporte para geolocalização.');
    }
}