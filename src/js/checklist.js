import getChecklistData from './AircraftData.mjs';
import { displayChecklist } from './ChecklistRender.mjs';
import {
  loadHeaderFooter,
  virtualChecklistState,
  saveState,
  getParam,
  registerLastFlight,
} from './utils.mjs';

// load header and footer
loadHeaderFooter();

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
