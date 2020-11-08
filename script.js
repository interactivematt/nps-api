'use strict';

const apiKey = 'E7KwHnPZ0AdwyNes6SaOrVNPHrIUH2mVqGQbCH1O';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getParks(query, stateFilter, maxResults=10) {
  console.log(stateFilter);
  const params = {
    q: query,
    stateCode: stateFilter,
    limit: maxResults,
    'api_key': apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  console.log(url);
}

function displayResults(responseJson) {
  $('.results').removeClass('hidden')
  $('.list').empty()
  for (let i = 0; i < responseJson.data.length; i++ ){
    console.log(responseJson.data[i].fullName)
    $('.list').append(`
      <div class="park">
        <img class="photo" src="${responseJson.data[i].images[0].url}">
        <h3>${responseJson.data[i].name}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href="${responseJson.data[i].url}" target="_blank">Link</a>
      </div>
    `)
  }
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    const stateFilter = $('#js-state-filter').val();
    getParks(searchTerm, stateFilter, maxResults);
    displayResults();
  })
}

$(watchForm);