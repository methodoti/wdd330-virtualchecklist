import { loadHeaderFooter } from './utils.mjs';

// load header and footer
loadHeaderFooter();

// Get the URL query string
const getString = window.location.search;
//console.log(getString);

const myInfo = new URLSearchParams(getString);

// List of expected form fields (Security list)
const fields = [
  'first-name',
  'last-name',
  'email',
  'aircraft',
  'developer',
  'information',
  'timestamp',
];

// Object to store the clean and validated data
let cleanFields = {};

// Check if the URL has any parameters (if it's not empty)
if (getString !== '') {
  // Function to validate and clean the data
  const checkInfo2 = (fields) => {
    // Loop through our list of expected fields
    fields.forEach((field) => {
      // If the field exists in the URL and is not empty
      if (myInfo.get(field)) {
        cleanFields[field] = myInfo.get(field); // Save the valid data
      } else {
        cleanFields[field] = 'N/A'; // Save "N/A" for empty or missing fields
      }
    });

    // Get the clean data from our object
    const firstName = cleanFields['first-name'];
    const lastName = cleanFields['last-name'];
    const email = cleanFields['email'];
    const aircraft = cleanFields['aircraft'];
    const developer = cleanFields['developer'];
    let currentDate = cleanFields['timestamp'];

    let formatedDate;

    // Handle the date formatting
    if (cleanFields['timestamp'] !== 'N/A') {
      // Convert to a real Date object and format to US standard
      const dateObject = new Date(currentDate);
      formatedDate = dateObject.toLocaleString('en-US');
    } else {
      // If no date was sent, keep the "N/A"
      formatedDate = cleanFields['timestamp'];
    }

    // Display the results on the HTML page
    document.querySelector('#results').innerHTML = `
            <p>Name: <strong>${firstName} ${lastName}</strong></p>
            <p>Email: <strong>${email}</strong></p>
            <p>Aircraft: <strong>${aircraft}</strong></p>
            <p>Developer: <strong>${developer}</strong></p>
            <p>Current date: <strong>${formatedDate}</strong></p>    
        `;
  };

  // Run the function
  checkInfo2(fields);
} else {
  // If the user accessed the page directly without form data
  document.querySelector('#results').innerHTML =
    `<p>No data received. Please fill the form on the right page!</p>`;
}
