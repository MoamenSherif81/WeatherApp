const citiesCont = document.querySelector('.cities');
const input = document.querySelector('.city-input');
const btn = document.querySelector('.submit-btn');

btn.addEventListener('click', searchForCity);
input.addEventListener('keypress', (event) => {
  if(event.key == 'Enter'){
    searchForCity();
  }
})

input.focus()

function searchForCity(){
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=4d8fb5b93d4af21d66a2948710284366&units=metric`);
  xhr.onload = function(){
    if(xhr.status === 404){
      Swal.fire({icon: 'error', title: 'Error', text:'City not found!'});
    } else{
      const cityInfo = JSON.parse(this.responseText);
      console.log(cityInfo);
      const newCity = document.createElement('div');
      newCity.className = 'city-cont col col-md-6 col-lg-4 mt-5';
      newCity.innerHTML = 
      `
      <div class="content d-flex align-items-center gap-5">
        <div>
        <div class="city-title">
        <div class="title-txt">
          ${cityInfo.name}
        </div>
        <div class="country rounded-pill bg-warning px-2 text-white">${cityInfo.sys.country}</div>
      </div>
      <div class="temperature">
        <span class="temp">${Math.round(cityInfo.main.temp)}</span>
        <span class="celesius">&#8451;</span>
      </div>
      <img class="image" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${cityInfo.weather[0].icon}.svg" alt="">
      <p class="weather-description mt-3 mb-0 text-secondary">${cityInfo.weather[0].description}</p>
        </div>
        <div class="map"></div>
      </div>
      <div class="small-bg"></div>
      `
      const corr = {lat: cityInfo.coord.lat, lng: cityInfo.coord.lon};
      const map = new google.maps.Map(newCity.querySelector('.map'), {
        zoom: 4,
        center: corr,
        disableDefaultUI: true,
      });
      const marker = new google.maps.Marker({
        position: corr,
        map: map
      });
      const image = newCity.querySelector('.image');
      image.addEventListener('load', () => {
        citiesCont.append(newCity);
        input.value = '';
      })
    }
  }
  xhr.send();
}