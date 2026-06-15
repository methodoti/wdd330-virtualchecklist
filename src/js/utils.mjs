export function renderWithTemplate(template, parentElement, data, callback) {
  // If need to clear, clean the parent HTML first
  parentElement.innerHTML = template;

  if (callback) {
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
  renderWithTemplate(headerTemplate, headerElement);
  //   updateCartCountBadge();

  const footerTemplate = await loadTemplate('/partials/footer.html');
  const footerElement = document.getElementById('main-footer');
  renderWithTemplate(footerTemplate, footerElement);
}
