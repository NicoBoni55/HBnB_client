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

fetch('http://127.0.0.1:5000/data/countries.json')
  .then((response) => response.json())
  .then((data) => {
    const countrySelect = document.getElementById('country-filter');

    const AllCountries = document.createElement('option');
    AllCountries.value = 'all';
    AllCountries.textContent = 'All';
    countrySelect.appendChild(AllCountries);

    data.forEach((country) => {
      const countriesList = document.createElement('option');
      countriesList.value = country.code;
      countriesList.textContent = country.name;
      countrySelect.appendChild(countriesList);
    });
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

function filterCountries(){
  const countrySelect = document.getElementById('country-filter');
  const selectedCountry = countrySelect.value;
  const cards = document.getElementsByClassName('filterDiv');

  for (let card of cards) {
    if (selectedCountry === 'all') {
      card.style.display = 'block';
    } else {
      card.style.display = card.getAttribute('data-country')
      if (card.getAttribute('data-country') === selectedCountry) {
        card.style.display = 'block';
      }
      else {
        card.style.display = 'none';
      }
    }
  }
}
document.getElementById('country-filter').addEventListener('change', filterCountries);  