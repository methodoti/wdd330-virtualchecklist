import getChecklistData from './AircraftData.mjs';
import { displayChecklist } from './ChecklistRender.mjs';
import { fetchSimBriefData } from './SimBriefData.mjs';
import {
  loadHeaderFooter,
  virtualChecklistState,
  saveState,
  getParam,
  registerLastFlight,
} from './utils.mjs';

// load header and footer
loadHeaderFooter();

// =========================================
// SIMBRIEF ID - LOCAL STORAGE
// =========================================
const simbriefInput = document.getElementById('simbrief-id-input');
const saveSimbriefBtn = document.getElementById('save-simbrief-btn');
const topFlightInfo = document.getElementById('top-flight-info');

// ================================================================================
// FLIGHT PLAN CENTRAL
// ================================================================================

// save the locaoStorage object
function saveFlightState(state) {
  localStorage.setItem('simbrief_plan', JSON.stringify(state));
}

// recover the localStorage object
function getFlightState() {
  const state = localStorage.getItem('simbrief_plan');
  return state ? JSON.parse(state) : null;
}

// update interface based on the state variables
function updateFlightUI(origin, destination) {
  if (origin && destination) {
    topFlightInfo.textContent = `Flight: ${origin} ➔ ${destination}`;
  } else {
    topFlightInfo.textContent = 'No Flight Plan';
  }
}

// call API, extract variables and save the state
async function handleLoadFlightPlan(pilotId) {
  if (!pilotId) return;

  const data = await fetchSimBriefData(pilotId);

  if (data && data.origin && data.destination) {
    // ----------------------------------------------------------------------
    // API Extracted Variables ( new JSON data here)
    // ----------------------------------------------------------------------
    const newFlightState = {
      pilotId: pilotId,
      origin: data.origin.icao_code,
      destination: data.destination.icao_code,
      // Next steps: payload, weather, etc.
    };
    // ----------------------------------------------------------------------

    // SAVE AND UPDATE
    saveFlightState(newFlightState);
    updateFlightUI(newFlightState.origin, newFlightState.destination);
    return true;
  }
  return false;
}

// ================================================================================
// TRIGGERS AND EVENTS
// ================================================================================

const currentFlight = getFlightState();
if (currentFlight) {
  simbriefInput.value = currentFlight.pilotId || '';
  updateFlightUI(currentFlight.origin, currentFlight.destination);
}

// Simbrief Bar visibiliti togle
const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
const topApiBar = document.querySelector('.top-api-bar');

toggleSettingsBtn.addEventListener('click', () => {
  topApiBar.classList.toggle('show');
});

// 'Load Plan'  = Main simbrief trigger
saveSimbriefBtn.addEventListener('click', async () => {
  const pilotId = simbriefInput.value.trim();

  if (pilotId) {
    saveSimbriefBtn.textContent = 'Loading...';
    saveSimbriefBtn.disabled = true;

    const success = await handleLoadFlightPlan(pilotId);

    saveSimbriefBtn.disabled = false;

    if (success) {
      saveSimbriefBtn.textContent = 'Loaded';
      saveSimbriefBtn.style.backgroundColor = 'var(--c-laser-green)';
    } else {
      saveSimbriefBtn.textContent = 'Error';
      saveSimbriefBtn.style.backgroundColor = 'var(--c-amber-flame)';
    }

    setTimeout(() => {
      saveSimbriefBtn.textContent = 'Load Plan';
      saveSimbriefBtn.style.backgroundColor = 'var(--primary-color)';
    }, 2000);
  }
});

// =========================================
// TOP BAR CONTROLS (Top, Expand, Collapse)
// =========================================
const btnTop = document.getElementById('toggle-top-btn');
const btnExpand = document.getElementById('toggle-expand-btn');
const btnCollapse = document.getElementById('toggle-colapse-btn');

// Go top
btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Expand all categories
btnExpand.addEventListener('click', () => {
  document.querySelectorAll('.checklistDiv').forEach((categoria) => {
    categoria.classList.add('show');
  });
});

// 3. Colapse All
btnCollapse.addEventListener('click', () => {
  document.querySelectorAll('.checklistDiv').forEach((categoria) => {
    categoria.classList.remove('show');
  });
});

// ==========================================
// TEMPLATES & RENDER
// ==========================================

let mySelection;

if (getParam(['aircraftId'])) {
  // console.log(getParam(['aircraftId']));
  const { aircraftId } = getParam(['aircraftId']);
  mySelection = aircraftId;
}
// console.log(mySelection);
// console.log(getParam(['aircraftId']));

const aircraftSelector = document.querySelector('#select-aircraft');
// category Section to generate the output
const categorySection = document.querySelector('#category-section');

// for the aircraft data global
let allAircraftData = [];

function addChecklistListeners(plane) {
  // LOCAL STORAGE
  //   console.log('addChecklistListeners ' + plane);
  const aircraftId = plane.aircraftId;
  //   console.log(aircraftId);
  // let currentState = getAircraftState(aircraftId);
  // ============================================
  // 1. Open/Close Categoris
  // ============================================
  const categoryTitles = document.querySelectorAll('.categoryTitleDiv');
  categoryTitles.forEach((titulo) => {
    titulo.addEventListener('click', () => {
      const span = titulo.querySelector('.categoryButton');
      const divChecklistDiv = titulo.nextElementSibling;

      span.classList.toggle('show');
      divChecklistDiv.classList.toggle('show');

      // LOCAL STORAGE
      virtualChecklistState[titulo.dataset.id] =
        divChecklistDiv.classList.contains('show');
      saveState();
    });
  });

  // ============================================
  // 2. Checklist Items click
  // ============================================
  const checklistItems = document.querySelectorAll('.checklistItem');
  checklistItems.forEach((item) => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');

      const checkIcon = item.querySelector('.checkIcon');
      if (checkIcon) checkIcon.classList.toggle('checked');

      const dot = item.querySelector('.dot');
      if (dot) dot.classList.toggle('checked');

      // LOCAL STORAGE
      virtualChecklistState[item.dataset.id] =
        item.classList.contains('checked');
      saveState();

      // LOCAL STORAGE - LAST FLIGHT
      if (item.classList.contains('checked')) {
        registerLastFlight(plane);
      }
    });
  });

  // ============================================
  // 3. Reset All Button
  // ============================================
  const resetAllButtons = document.querySelectorAll('.resetAll');
  resetAllButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const categorySection = document.querySelector('#category-section');
      const checkedElements = categorySection.querySelectorAll('.checked');

      checkedElements.forEach((element) => {
        element.classList.remove('checked');
      });
      // LOCAL STORAGE
      Object.keys(virtualChecklistState).forEach((key) => {
        if (key.startsWith(aircraftId)) {
          delete virtualChecklistState[key];
        }
      });
      saveState();
    });
  });

  // ============================================
  // 4. Categories Reset Buttons
  // ============================================
  const resetButtons = document.querySelectorAll('.reset');
  resetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const divChecklistDiv = button.closest('.checklistDiv');
      const checkedElements = divChecklistDiv.querySelectorAll('.checked');
      checkedElements.forEach((element) => {
        element.classList.remove('checked');

        // LOCAL STORAGE
        virtualChecklistState[element.dataset.id] = false;
      });

      // LOCAL STORAGE
      saveState();
    });
  });
}

// LOCAL STORAGE
function restoreChecklistState() {
  const checklistItems = document.querySelectorAll('.checklistItem');
  checklistItems.forEach((item) => {
    const id = item.dataset.id;
    if (virtualChecklistState[id] === true) {
      item.classList.add('checked');
      const checkIcon = item.querySelector('.checkIcon');
      if (checkIcon) checkIcon.classList.add('checked');
      const dot = item.querySelector('.dot');
      if (dot) dot.classList.add('checked');
    }
  });

  const categoryTitles = document.querySelectorAll('.categoryTitleDiv');
  categoryTitles.forEach((titulo) => {
    const id = titulo.dataset.id;
    const span = titulo.querySelector('.categoryButton');
    const divChecklistDiv = titulo.nextElementSibling;

    const hasCheckedItems =
      divChecklistDiv.querySelectorAll('.checked').length > 0;

    if (hasCheckedItems) {
      if (virtualChecklistState[id] === true) {
        span.classList.add('show');
        divChecklistDiv.classList.add('show');
      } else {
        span.classList.remove('show');
        divChecklistDiv.classList.remove('show');
      }
    } else {
      span.classList.remove('show');
      divChecklistDiv.classList.remove('show');

      if (virtualChecklistState[id] !== undefined) {
        delete virtualChecklistState[id];
        saveState();
      }
    }
  });
}

aircraftSelector.addEventListener('change', function () {
  const aircraftSelected = this.value;
  //   const aircraftName = this.value; // lint remove!

  categorySection.innerHTML = ''; // clean the Section for not showing button repetitions.
  // console.log(this.textContent); // just to see if it works.

  if (aircraftSelected !== '') {
    // console.log(aircraftSelected);
    // ========== where the magic begins!!!! ==========
    const plane = allAircraftData.find(
      (p) => p.aircraftId === aircraftSelected,
    );
    // console.log(plane);

    // ********************************************
    // CALL DISPLAY CHECKLIST
    // ********************************************
    displayChecklist(plane, categorySection);
    //   console.log('CALL DISPLAY CHECKLIST ' + plane);
    //   addChecklistListeners(aircraftSelected);
    addChecklistListeners(plane);
    //   console.log('CALL DISPLAY CHECKLIST ' + aircraftSelected);

    // LOCAL STORAGE
    restoreChecklistState();

    document.title = `${plane.aircraftName} | Virtual Checklist | `;
  } else {
    // console.warn('No plane selected');
    document.title = `Aircraft Checklists | Virtual Checklist`;
  }
});

function loadSelector(aircrafts) {
  aircrafts.forEach((plane) => {
    // console.log(plane);  //just to see individual plane

    const newOption = document.createElement('option');

    // displays on screen for the user
    newOption.textContent = plane.aircraftName;
    // used by the system on get
    newOption.value = plane.aircraftId;

    aircraftSelector.appendChild(newOption);
  });
  // console.log(mySelection);

  if (mySelection !== undefined) {
    // console.log(mySelection);
    aircraftSelector.value = mySelection;
    aircraftSelector.dispatchEvent(new Event('change'));
    // console.log(mySelection.get("aircraftId"));
  }
}

// ==========================================
// INITIALIZERS
// ==========================================

// function to initialize (need to be ASYNC to use AWAIT)
async function init() {
  // ask for the data and wait (AWAIT) for the delivery
  const aircrafts = await getChecklistData();

  allAircraftData = aircrafts;
  // console.log(allAircraftData);
  // ********************************************
  // MAIN SWITCH!!!
  // ********************************************
  loadSelector(aircrafts);
}

init(); // inicialize the imported data
