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

async function loadTemplate(path) {
  const response = await fetch(path);
  const template = await response.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const headerElement = document.getElementById('main-header');
  // Passes the callback function setMenuCurrent (without parenteses for not running it now)
  renderWithTemplate(headerTemplate, headerElement, null, setMenuCurrent);

  const footerTemplate = await loadTemplate('/partials/footer.html');
  const footerElement = document.getElementById('main-footer');
  renderWithTemplate(footerTemplate, footerElement);

  // add currentYear and lastModified to footer
  const currentYearSpan = document.querySelector('#currentyear');
  const lastModifiedSpan = document.querySelector('#lastModified');
  const currentYear = new Date().getFullYear();
  currentYearSpan.textContent = new Date().getFullYear();
  const lastModified = document.lastModified;
  lastModifiedSpan.textContent = lastModified;
}

function setMenuCurrent() {
  // Finds URL from the current user page
  const currentPage = window.location.pathname;
  // Finds all <a> tag from the newly created menu (The DOM is updated and renderized at this point!)
  const menuLinks = document.querySelectorAll('#nav-bar ul li a');
  menuLinks.forEach((link) => {
    // console.log(link.parentElement);
    // Get the href from each link (eg.: '/checklist/index.html')
    const linkPage = link.getAttribute('href');
    // If the current page = link
    if (currentPage === linkPage) {
      // add the 'current' class to the PARENT (<li>) of the element <a> of the current link from the menuLinks array.
      link.parentElement.classList.add('current');
    } else if (
      currentPage === '/add_aircraft/thankyou.html' &&
      linkPage === '/add_aircraft/index.html'
    ) {
      // add the 'current' class to Add Aricraft on thankyou page.
      link.parentElement.classList.add('current');
    } else {
      // If not, clean the 'current' class
      link.parentElement.classList.remove('current');
    }
  });
}
