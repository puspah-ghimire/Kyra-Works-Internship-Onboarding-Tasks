# Privacy Preference Manager

A simple system that allows the user to manage their privacy preferences.

## Features
- Toggle analytics collection, data sharing with third parties, marketing communications, surveillance feed access
- Preferences are saved to a JSON file
- Clean, simple UI

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open your browser to: http://localhost:3000

## How It Works

### Frontend (index.html)
- Simple HTML page with toggle switches
- Clear labels for each privacy setting
- JavaScript handles saving/loading preferences via API calls

### Backend (server.js)
- Express.js server with 2 API endpoints:
  - GET /api/preferences - Load current preferences
  - POST /api/preferences - Save new preferences
- Uses JSON file for persistence

### Storage (preferences.json)
- Automatically created when preferences are first saved
- Simple JSON structure with boolean values

## Default Settings
- Analytics: ON
- Data Sharing: OFF
- Marketing: OFF
- Surveillance Access: ON
