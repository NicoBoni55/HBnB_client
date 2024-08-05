document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      async function loginUser(email, password) {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/`;
          console.log(`Cookie set: token=${data.access_token}`);
          window.location.href = '/index';
        } else {
          alert('Login failed: ' + response.statusText);
        }
      }

      loginUser(email, password);
    });
  }
});

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  if (!token) {
      loginLink.style.display = 'block';
  } else {
      loginLink.style.display = 'none';
      // Fetch places data if the user is authenticated
      fetchPlaces(token);
  }
}
function getCookie(name) {
  const cookie = document.cookie.split(';');
  const cookieValue = cookie.find(cookie => cookie.includes(name + '='));
  if (cookieValue){
    return cookieValue.split('=')[1];
  }
  else{
    return null;
  }
}

document.addEventListener('DOMContentLoaded', checkAuthentication);

async function fetchPlaces(token) {
  try {
    const response = await fetch('http://127.0.0.1:5000/data/places.json', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if(!response.ok) {
      throw new Error('Failed to fetch places data');
    }
    const data = await response.json();
    console.log(data);
    displayPlaces(data);
    listCountryFilter(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  placesList.innerHTML = '';

  places.forEach(place => {
    const placeCard = document.createElement('div');
    placeCard.className = 'place-card';
    placeCard.setAttribute('data-country', place.country_code);
    
    const placeImage = `/static/images/${place.id}.jpg`;

    placeCard.innerHTML = `
      <div class="place-details">
        <img class="place-image" src="${placeImage}" alt="${place.id}">
        <h2>${place.id}</h2>
        <p>Price per night: $${place.price_per_night}</p>
        <p>Location: ${place.country_name}</p>
        <a href="place.html">
          <button class="details-button">View Details</button>
        </a>
      </div>
    `;

    placesList.appendChild(placeCard);
  });
}

function filterCountries(){
  const countrySelect = document.getElementById('country-filter');
  const selectedCountry = countrySelect.value;
  const cards = document.getElementsByClassName('place-card');

  for (let card of cards) {
    const cardCountry = card.getAttribute('data-country');
    if (selectedCountry === 'all' || selectedCountry === cardCountry) {
      card.style.display = 'block';
    }
    else {
      card.style.display = 'none';
    }
  }
}
document.getElementById('country-filter').addEventListener('change', (event) => {
const selectedCountry = event.target.value;
filterCountries(selectedCountry);
});
function listCountryFilter(data){
  const countrySelect = document.getElementById('country-filter');
  const allCountries = document.createElement('option');
  allCountries.value = 'all';
  allCountries.textContent = 'All';
  countrySelect.appendChild(allCountries); 

  const country = new Set();

  data.forEach(place => {
    if(!country.has(place.country_code)){
      country.add(place.country_code);
    const countryOption = document.createElement('option');
    countryOption.value = place.country_code;
    countryOption.textContent = place.country_name;
    countrySelect.appendChild(countryOption);
    }
  });
}