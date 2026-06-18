import { renderWithTemplate, renderListWithTemplate } from './utils.mjs';

export function initCheckList() {
  console.log('Checklist Module Loaded');
}

// ==========================================
// TEMPLATES
// ==========================================

function aircraftNameTemplate(aircraft) {
  return `
    <h2 class="aircraftName">${aircraft}</h2>
  `;
}

function resetAllButtonTemplate() {
  return `
    <button class="resetAll buttons buttonsRounded">Reset All</button>
  `;
}

function resetButtonTemplate() {
  return `
    <div class="resetDiv"><button class="reset buttons buttonsRounded">Reset</button></div>
  `;
}

function categoryTitleTemplate(categoryName, aircraftId) {
  return `
    <div class="categoryTitleDiv cardTitle" aria-label="${categoryName}" data-id="${aircraftId}-tab-${categoryName}">
      <h3 class="cardTitle">${categoryName}</h3>
      <span class="categoryButton"></span>
    </div>
  `;
}

// case Checkpoint
function checkpointTemplate(item, categoryName, aircraftId) {
  return `
    <div class="checklistItem type-checkpoint" data-id="${aircraftId}-${categoryName}-${item.task}">
        <div class="check">
          <div class="checkIcon"></div>
        </div>
        <div class="item type-checkpoint">
            <span class="task">${item.task}</span>
            <div class="dot"></div>
            <span class="action">${item.action}</span>
        </div>
    </div>`;
}

// case Info
function infoTemplate(item, categoryName, aircraftId) {
  return `
    <div class="checklistItem type-info" data-id="${aircraftId}-${categoryName}-${item.task}">
      <div class="check">
        <div class="checkIcon"></div>
      </div>
      <div class="item type-info">
        <span class="task">${item.task}</span>
        <div class="dot"></div>
        <span class="action">${item.action}</span>
      </div>
    </div>`;
}

// Case Subtitle
function subtitleTemplate(item, categoryName, aircraftId) {
  return `
    <div class="checklistItem type-subtitle" data-id="${aircraftId}-${categoryName}-${item.task}">
        <div class="item type-subtitle">
            <span class="task">${item.text}</span>
        </div>
    </div>`;
}

// Case SimAction
function simActionTemplate(item, categoryName, aircraftId) {
  return `
    <div class="checklistItem type-sim-action" data-id="${aircraftId}-${categoryName}-${item.task}">
      <div class="check">
        <div class="checkIcon"></div>
      </div>
      <div class="item type-sim-action">
        <span class="task">${item.task}</span>
      </div>
    </div>`;
}

// Case ATC
function AtcTemplate(item, categoryName, aircraftId) {
  return `
    <div class="checklistItem type-checkpoint" data-id="${aircraftId}-${categoryName}-${item.task}">
      <div class="check">
        <div class="checkIcon"></div>
      </div>
      <div class="item type-checkpoint type-atc">
        <span class="task">${item.task}</span>
        <div class="dot"></div>
        <span class="action">${item.action}</span>
      </div>
    </div>`;
}

function itemRender(item, categoryName, aircraftId) {
  switch (item.type) {
    case 'checkpoint':
      return checkpointTemplate(item, categoryName, aircraftId);
    case 'info':
      return infoTemplate(item, categoryName, aircraftId);
    case 'subtitle':
      return subtitleTemplate(item, categoryName, aircraftId);
    case 'sim-action':
      return simActionTemplate(item, categoryName, aircraftId);
    case 'atc':
      return AtcTemplate(item, categoryName, aircraftId);
    default:
      // console.log(`Not Found: ${item.type}`);
      return '';
  }
  // // console.log(item);
  // const { type, task, action } = item;

  // if (type === 'checkpoint') {
  //   console.log(item.type);
  //   return checkpointTemplate(item);
  // } else if (type === 'info') {
  //   return infoTemplate(item);
  // } else if (type === 'subtitle') {
  //   return subtitleTemplate(item);
  // } else if (type === 'sim-action') {
  //   return simActionTemplate(item);
  // } else if (type === 'atc') {
  //   return AtcTemplate(item);
  // }
}

// ==========================================
// RENDER
// ==========================================

export function displayChecklist(plane, parentElement) {
  // console.log(plane);

  let checklistPecasHTML = [];
  // // Aircraft Name for <h2>

  const titleHTML = aircraftNameTemplate(plane.aircraftName);
  checklistPecasHTML.push(titleHTML);
  // parentElement.insertAdjacentHTML('beforeend', titleHTML);

  // // Reset All Button
  const resetAllButtonHTML = resetAllButtonTemplate();
  checklistPecasHTML.push(resetAllButtonHTML);

  plane.checklists.forEach((element) => {
    const categoryTitleHTML = categoryTitleTemplate(
      element.categoryName,
      plane.aircraftId,
    );
    checklistPecasHTML.push(categoryTitleHTML);

    checklistPecasHTML.push('<div class="checklistDiv cards">');
    element.items.forEach((item) => {
      const itemHTML = itemRender(item, element.categoryName, plane.aircraftId);
      checklistPecasHTML.push(itemHTML);
    });

    const resetButtonHTML = resetButtonTemplate();
    checklistPecasHTML.push(resetButtonHTML);

    checklistPecasHTML.push('</div>');
  });

  checklistPecasHTML.push(resetAllButtonHTML);

  document.querySelector('.categorySection').innerHTML =
    checklistPecasHTML.join('');
}
