import express from 'express';
import { google } from 'googleapis';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(express.static('.'));

let connectionSettings;
let cachedSpreadsheetId = null;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings?.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '';

async function createSpreadsheet() {
  const sheets = await getUncachableGoogleSheetClient();
  
  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'Dayanah Franklin - Email List'
      },
      sheets: [{
        properties: {
          title: 'User Emails'
        },
        data: [{
          rowData: [{
            values: [
              { userEnteredValue: { stringValue: 'Email Address' } },
              { userEnteredValue: { stringValue: 'Date Submitted' } }
            ]
          }]
        }]
      }]
    }
  });
  
  console.log('Created spreadsheet with ID:', response.data.spreadsheetId);
  console.log('IMPORTANT: Add this to your environment variables:');
  console.log(`SPREADSHEET_ID=${response.data.spreadsheetId}`);
  
  return response.data.spreadsheetId;
}

async function addEmailToSheet(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const sheets = await getUncachableGoogleSheetClient();
  
  let spreadsheetId = cachedSpreadsheetId || SPREADSHEET_ID;
  
  if (!spreadsheetId) {
    spreadsheetId = await createSpreadsheet();
    cachedSpreadsheetId = spreadsheetId;
  }
  
  const existingEmails = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: 'User Emails!A:A'
  });
  
  const emails = existingEmails.data.values || [];
  const emailExists = emails.some(row => row[0] && row[0].toLowerCase() === normalizedEmail);
  
  if (emailExists) {
    return { success: false, message: 'Email already submitted!' };
  }
  
  const timestamp = new Date().toLocaleString();
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: 'User Emails!A:B',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[normalizedEmail, timestamp]]
    }
  });
  
  return { success: true, message: 'Email submitted successfully!' };
}

app.post('/submit-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const normalizedEmail = email.trim();
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }
    
    const result = await addEmailToSheet(normalizedEmail);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error submitting email:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  if (!SPREADSHEET_ID) {
    console.log('Note: SPREADSHEET_ID not set. A new spreadsheet will be created on first email submission.');
  }
});
