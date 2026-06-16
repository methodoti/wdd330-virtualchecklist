import { loadHeaderFooter } from './utils.mjs';

// load header and footer
loadHeaderFooter();

// to get the time of the page load on join.html timestamp hidden input
const timestamp = document.querySelector('#timestamp');
if (timestamp) {
  document.getElementById('timestamp').value = new Date().toISOString();
}
