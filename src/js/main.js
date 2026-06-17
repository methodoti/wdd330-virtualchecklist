import getChecklistData from './AircraftData.mjs';
import { initSimBrief } from './SimBriefData.mjs';
import { initWeather } from './WeatherData.mjs';
import { initCheckList } from './ChecklistRender.mjs';
import { renderListWithTemplate, renderWithTemplate, loadHeaderFooter } from './utils.mjs';

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
    // <div class="lastflightDiv cards">
    //     <div id="lasflight-img" class="lastflightImg" style="background-image: url(&quot;images/b737-800.webp&quot;); background-size: cover; background-position: center center;"><div></div></div>
    //     <div class="lastflightAircraft">
    //         <p class="lastflightP ">Aircraft: <span id="last-aircraft">Boeing 737-800</span></p>
    //         <p>Date: <span id="last-date">Jun 15, 2026</span></p>
    //     </div>
    // </div>
  return `
        <div id="lasflight-img" class="lastflightImg" style="background-image: url('/images/aircrafts/${flightData.id}.webp'); background-size: cover; background-position: center center;"><div></div></div>
        <div class="lastflightAircraft">
            <p class="lastflightP ">Aircraft: <span id="last-aircraft">${flightData.name}</span></p>
            <p>Date: <span id="last-date">${flightData.date}</span></p>
        </div>
    `;
}

function displayLastFlight() {

    const lastFlightData = JSON.parse(localStorage.getItem("lastFlight"));
    if (!lastFlightData) {
        registerLastFlight();
    }
    // console.log(lastFlightData);
    // const lastflightSection = document.querySelector(".lastflightSection");
    const lastFlightDiv = document.querySelector('.lastflightDiv');

    if (!lastFlightDiv) {
        registerLastFlight();
    }
       // return; // good practice!
  
    const htmlStrings = lastFlightTemplate(lastFlightData);
    // const headerTemplate = await loadTemplate('/partials/header.html');
    //   const headerElement = document.getElementById('main-header');
      // Passes the callback function setMenuCurrent (without parenteses for not running it now)
    renderWithTemplate(htmlStrings, lastFlightDiv);

}

// função temporaria! só para poder testar o template e a página
function registerLastFlight() {
            const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const lastFlight = {
                id: "b737-800",
                name: "Boeing 737-800",
                date: currentDate
            };
            localStorage.setItem("lastFlight", JSON.stringify(lastFlight));
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
  initSimBrief();
  initWeather();
  initCheckList();
}

// ==========================================
// INIT
// ==========================================
init(); // inicialize the imported data
