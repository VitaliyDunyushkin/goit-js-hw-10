import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
let message

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

////////////-------------

function onInput(event) {
  //   console.dir(event.target.value);
  const country = event.target.value.trim();
  fetchCountries(country)
    .then(data => {
      // console.log(data);

      // for (const { flags, name, capital, languages, population } of data) {
      // console.log('flag svg =', flags.svg);
      // console.log('name official =', name.official);
      // console.log('capital =', capital[0]);
      // console.log('languages =', Object.values(languages).join(', '));
      // console.log('population =', population);
      // const info = creatMarkup(flags.svg, name.official);
      // console.log(info);
      // }

      countryList.innerHTML = '';
      countryInfo.innerHTML = '';

      if (data.length === undefined) {
        throw new Error((message = 'Oops, there is no country with that name'));
      } else if (data.length === 1) {
        const markup = data.reduce(
          (markup, country) =>
            markup +
            creatMarkupInfo(
              country.flags.svg,
              country.name.official,
              country.capital[0],
              country.population,
              Object.values(country.languages).join(', ')
            ),
          ''
        );
        // console.log(markup);
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        countryInfo.innerHTML = markup;
      } else if (data.length <= 10) {
        const markup = data.reduce(
          (markup, country) =>
            markup + creatMarkupList(country.flags.svg, country.name.official),
          ''
        );
        // console.log(markup);
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        countryList.innerHTML = markup;
      } else {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => Notify.failure(message));
}

function creatMarkupList(flag, name) {
  return `<li class = "country__item">   
    <img class="flag__image" src="${flag}" width=50 alt="Flag of ${name}"/>   
    <h2 class="country__name">${name}</h2>
</li>`;
}

function creatMarkupInfo(flag, name, capital, population, languages) {
  return `<img class="flag__image" src="${flag}" width=50 alt="Flag of ${name}"/>   
    <h2 class="country__name">${name}</h2>
    <p class="country__capital">Capital: ${capital}</p>
    <p class="country__population">Population: ${population}</p>
    <p class="country__languages">Languages: ${languages}</p>
`;
}
