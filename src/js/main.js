import getChecklistData from './AircraftData.mjs';
// import { initSimBrief } from './SimBriefData.mjs';
// import { initWeather } from './WeatherData.mjs';
// import { initCheckList } from './ChecklistRender.mjs';
import {
  renderListWithTemplate,
  renderWithTemplate,
  loadHeaderFooter,
  getLastFlight,
} from './utils.mjs';

// load header and footer
loadHeaderFooter();

// ==========================================
// TEMPLATES & RENDER
// ==========================================
function aircraftButtonsTemplate(aircraft) {
  // <a class="buttons" href="./checklist.html?aircraftId=b737-800"><p>Boeing 737-800</p></a>
  return `
        <a class="buttons" href="/checklist/index.html?aircraftId=${aircraft.aircraftId}"><p>${aircraft.aircraftName}</p></a>
    `;
}

function displayAircraftButtons(aircrafts) {
  const chooseDiv = document.querySelector('#choose-div');
  if (!chooseDiv) return; // good practice!
  //....................template function / html target / list................
  renderListWithTemplate(
    aircraftButtonsTemplate,
    chooseDiv,
    aircrafts,
    'beforeend',
  );
}

function lastFlightTemplate(flightData) {
  return `
        <div id="lasflight-img" class="lastflightImg" style="background-image: url('/images/aircrafts/${flightData.id}.webp'); background-size: cover; background-position: center center;"><div></div></div>
        <div class="lastflightAircraft">
            <p class="lastflightP ">Aircraft: <span id="last-aircraft">${flightData.name}</span></p>
            <p>Date: <span id="last-date">${flightData.date}</span></p>
        </div>
    `;
}

function displayLastFlight() {
  // const lastFlightData = JSON.parse(localStorage.getItem('lastFlight'));
  const lastFlightData = getLastFlight();
  // console.log(lastFlightData);

  // console.log(lastFlightData);
  const lastFlightDiv = document.querySelector('.lastflightDiv');

  if (!lastFlightData) {
    document.querySelector('#last-aircraft').textContent = 'No flight!';
    document.querySelector('#last-date').textContent = '';
    return;
  }

  const htmlStrings = lastFlightTemplate(lastFlightData);
  // Passes the callback function setMenuCurrent (without parenteses for not running it now)
  renderWithTemplate(htmlStrings, lastFlightDiv);
}

// ==========================================
// INITIALIZERS
// ==========================================
// function to initialize (need to be ASYNC to use AWAIT)
async function initAircraftData() {
  // ask for the data and wait (AWAIT) for the delivery
  const aircrafts = await getChecklistData();
  return aircrafts;
}

async function init() {
  // init Aircraft data
  const aircrafts = await initAircraftData();
  displayAircraftButtons(aircrafts);
  displayLastFlight();

  //init dummy functions
  // initSimBrief();
  // initWeather();
  // initCheckList();
}

// ==========================================
// INIT
// ==========================================
init(); // inicialize the imported data
