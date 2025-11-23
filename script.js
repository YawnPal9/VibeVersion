const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Store the spreadsheet ID in a variable
const SHEET_NAME = 'User Emails';
const SECRET_KEY = 'YOUR_SECRET_KEY'; // Optional: Add a simple secret key to control access

function doPost(e) {
  try {
    // Ensure the request is coming from a trusted source
    if (e.parameter.secret !== SECRET_KEY) {
      return ContentService.createTextOutput("Unauthorized");
    }

    // Retrieve the email parameter from the POST request
    const email = e.parameter.email;

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      return ContentService.createTextOutput("Invalid email address.");
    }

    // Open the spreadsheet and access the sheet
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    // Check if the email already exists in the sheet
    const existingEmails = sheet.getRange('A:A').getValues();
    const emailExists = existingEmails.some(row => row[0] === email);
    if (emailExists) {
      return ContentService.createTextOutput("Email already submitted.");
    }

// App
