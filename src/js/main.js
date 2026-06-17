import getChecklistData from './AircraftData.mjs';
import { initSimBrief } from './SimBriefData.mjs';
import { initWeather } from './WeatherData.mjs';
import { initCheckList } from './ChecklistRender.mjs';
import { renderListWithTemplate, loadHeaderFooter } from './utils.mjs';

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

  //init dummy functions
  initSimBrief();
  initWeather();
  initCheckList();
}

// ==========================================
// INIT
// ==========================================
init(); // inicialize the imported data
