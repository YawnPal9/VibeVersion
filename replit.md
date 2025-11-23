# Overview

This is a personal networking landing page for Dayanah Franklin that collects visitor email addresses through a form submission. The application features a pink-themed frontend with a background image and integrates with Google Sheets to store submitted email addresses. The system uses Express.js as the backend server and the Google Sheets API for data persistence.

# Recent Changes (November 23, 2025)

- Implemented full Google Sheets integration using Replit Connectors
- Created Express.js backend server (`server.js`) to handle email submissions
- Added automatic spreadsheet creation on first email submission
- Implemented email normalization (trim and lowercase) for duplicate prevention
- Added in-memory caching for spreadsheet ID to prevent multiple spreadsheet creation
- Updated HTML form with proper IDs and real-time feedback messages
- Added cache control headers to prevent browser caching issues
- Removed unused files (script.js, style.css)

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Single Page Application (SPA)**
- Static HTML/CSS/JavaScript served directly from the Express server
- Inline CSS styling in `index.html` with custom fonts from Google Fonts
- Pink-themed design (#FF69B4 Barbie pink) with semi-transparent overlays
- Background image asset (`/assets/dayanah-bg.jpg`)
- Form submission handled via client-side JavaScript

**Rationale**: A simple static frontend is appropriate for a landing page with minimal interactivity. Inline styles keep everything in one file for easy maintenance of this small project.

## Backend Architecture

**Express.js Server (v5.1.0)**
- ES6 module syntax (`type: "module"` in package.json)
- Serves static files from the root directory
- JSON and URL-encoded body parsing middleware
- Cache control headers to prevent stale content
- Runs on port 5000

**Rationale**: Express provides a lightweight, flexible server for handling both static file serving and API endpoints. The minimal middleware stack keeps the application simple and performant.

## Data Storage Solution

**Google Sheets as Database**
- Spreadsheet stores user emails in a sheet named "User Emails" with columns for Email Address and Date Submitted
- OAuth 2.0 authentication via Replit Connectors (google-sheet integration)
- Access token caching with expiration checking
- Email validation and duplicate detection with normalization (trim + lowercase)
- Automatic spreadsheet creation on first email submission if SPREADSHEET_ID not set
- In-memory caching of spreadsheet ID to prevent creating multiple sheets per session

**Implementation Details**:
- Server endpoint: POST `/submit-email` accepts JSON with email field
- Email normalization: All emails are trimmed and converted to lowercase before storage
- Duplicate detection: Case-insensitive comparison to prevent duplicate entries
- Response: JSON with `success` boolean and `message` string

**Rationale**: Google Sheets provides a simple, no-cost data storage solution for a low-traffic landing page. It allows non-technical users to view and manage collected emails through a familiar interface. For a networking page collecting contact information, this is more practical than setting up a traditional database.

**Alternatives Considered**: Traditional databases (PostgreSQL, MongoDB) would add unnecessary complexity and infrastructure requirements for this use case.

## Authentication & Authorization

**Replit-Specific OAuth Flow**
- Uses Replit Connectors API for Google Sheets authentication
- Token retrieval via `REPLIT_CONNECTORS_HOSTNAME` environment variable
- Supports both repl identity (`REPL_IDENTITY`) and deployment renewal tokens (`WEB_REPL_RENEWAL`)
- Access token caching with expiration checking and optional chaining for safety
- No secret key validation required (authentication handled by Replit Connectors)

**Rationale**: Leveraging Replit's built-in connector system simplifies OAuth implementation and eliminates the need to manage credentials manually. The dual token support ensures the application works in both development and production environments.

# External Dependencies

## Third-Party Services

**Google Sheets API (googleapis v166.0.0)**
- Primary data storage backend
- Accessed via OAuth 2.0 through Replit Connectors
- Requires spreadsheet ID configuration

**Replit Connectors API**
- Handles OAuth token management
- Endpoint: `https://{REPLIT_CONNECTORS_HOSTNAME}/api/v2/connection`
- Requires connector name: `google-sheet`

## NPM Packages

**Express (v5.1.0)**
- Web server framework
- Static file serving
- Routing and middleware support

**body-parser (v2.2.0)**
- HTTP request body parsing
- JSON and URL-encoded data handling

**googleapis (v166.0.0)**
- Official Google APIs client library
- Google Sheets API integration

## External Resources

**Google Fonts**
- Multiple font families loaded via CDN
- Includes: Inconsolata, Fira Mono, Jersey 20 Charted, Press Start 2P, Rampart One, Rye, Satisfy, Share Tech Mono, Titillium Web, Rubik Broken Fax, Rubik Scribble

## Environment Variables

**Automatically provided by Replit**:
- `REPLIT_CONNECTORS_HOSTNAME` - Replit connectors API hostname
- `REPL_IDENTITY` OR `WEB_REPL_RENEWAL` - Authentication tokens for Replit

**Optional**:
- `SPREADSHEET_ID` - Google Sheets spreadsheet ID (if not set, a new spreadsheet will be created automatically on first email submission)

**Note**: When a new spreadsheet is created, the ID will be logged to the console. You can add this to your environment variables to persist the spreadsheet across server restarts.