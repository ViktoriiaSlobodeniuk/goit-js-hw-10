import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let name = e.target.value.trim();
  if (name === '') {
    clear(countryList);
    clear(countryInfo);
    return;
  }

  fetchCountries(name)
    .then(res => {
      console.log(res);
      handlingResult(res);
    })
    .catch(() => {
      clear(countryList);
      clear(countryInfo);
      Notify.failure('Opps, there is no country with that name');
    });
}

function handlingResult(countries) {
  if (countries.length > 10) {
    clear(countryList);
    clear(countryInfo);
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length >= 2 && countries.length <= 10) {
    listMarkup(countries);

    clear(countryInfo);
  } else {
    clear(countryList);

    oneCountryMarkup(countries);
  }
}

function listMarkup(countries) {
  const markup = countries
    .map(country => {
      return `<li><p><img src='${country.flags.svg}'alt='flag' width ='20px'>  ${country.name.official}</p></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function oneCountryMarkup(country) {
  const markup = country
    .map(country => {
      return `
          <p><img src='${country.flags.svg}'alt='flag' width ='20px'>  ${
        country.name.official
      }</p>
          <p><b>Capital</b>: ${country.capital}</p>
          <p><b>Population</b>: ${country.population}</p>          
          <p><b>Language</b>: ${Object.values(country.languages)}</p>
        `;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function clear(param) {
  param.innerHTML = '';
}
