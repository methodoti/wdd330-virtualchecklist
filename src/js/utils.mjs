export function renderWithTemplate(template, parentElement, data, callback) {
  // If need to clear, clean the parent HTML first
  parentElement.innerHTML = template;
  // console.log(callback);

  if (callback) {
    // console.log(callback);
    // console.log(data);
    callback(data);
  }
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  // If need to clear, clean the parent HTML first
  if (clear) {
    parentElement.innerHTML = '';
  }
  // pass the list template, using map
  const htmlStrings = list.map(templateFn);
  // insert on DOM in the choosed position
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const headerElement = document.getElementById('main-header');
  // Passes the callback function setMenuCurrent (without parenteses for not running it now)
  renderWithTemplate(headerTemplate, headerElement, null, initHeader);

  const footerTemplate = await loadTemplate('/partials/footer.html');
  const footerElement = document.getElementById('main-footer');
  renderWithTemplate(footerTemplate, footerElement, null, initFooter);
}

// init header functions: the right async way.  Place it on the renderWithTemplate()
function initHeader() {
  setMenuCurrent();
  menuHamburguer();
}

// init footer functions: the right async way. Place it on the renderWithTemplate()
function initFooter() {
  footerDates();
}

// Put the little airplane on the current menu
function setMenuCurrent() {
  // Finds URL from the current user page
  const currentPage = window.location.pathname;
  // console.log('current page: '+currentPage);
  // Finds all <a> tag from the newly created menu (The DOM is updated and renderized at this point!)
  const menuLinks = document.querySelectorAll('#nav-bar ul li a');
  menuLinks.forEach((link) => {
    // console.log(link.parentElement);
    // Get the href from each link (eg.: '/checklist/index.html')
    const linkPage = link.getAttribute('href');
    // console.log('link page: ' + linkPage);

    // if its / or /indes.html = main home page
    const isHomeContext =
      (currentPage === '/' || currentPage === '/index.html') &&
      linkPage === '/index.html';
    // console.log(isHomeContext);
    // if its /checklist/ or /checlist/index.html = checklist home page
    const isChecklistContext =
      currentPage.includes('/checklist/') && linkPage.includes('/checklist/');
    // if its /add_aircraft/ or /add_aircraft/index.html = add aircraft home page
    const isAddAircraftContext =
      currentPage.includes('/add_aircraft/') &&
      linkPage.includes('/add_aircraft/');

    if (isHomeContext || isChecklistContext || isAddAircraftContext) {
      // add the 'current' class to Add Aricraft on thankyou page.
      link.parentElement.classList.add('current');
    } else {
      // If not, clean the 'current' class
      link.parentElement.classList.remove('current');
    }
  });
}

// initiate the menu hamburger
function menuHamburguer() {
  const navButton = document.querySelector('#nav-button');
  const navBar = document.querySelector('#nav-bar');

  navButton.addEventListener('click', () => {
    navButton.classList.toggle('show');
    navBar.classList.toggle('show');
  });
}

// add currentYear and lastModified to footer
function footerDates() {
  const currentYearSpan = document.querySelector('#currentyear');
  const lastModifiedSpan = document.querySelector('#lastModified');
  const currentYear = new Date().getFullYear();
  currentYearSpan.textContent = new Date().getFullYear();
  const lastModified = document.lastModified;
  lastModifiedSpan.textContent = lastModified;
}
