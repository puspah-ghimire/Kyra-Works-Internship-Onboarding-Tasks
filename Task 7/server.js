const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const PREFERENCES_FILE = 'preferences.json';

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Default preferences
const defaultPreferences = {
    analytics: true,
    dataSharing: false,
    marketing: false,
    surveillanceAccess: true
};

// Load preferences from file
function loadPreferences() {
    try {
        if (fs.existsSync(PREFERENCES_FILE)) {
            const data = fs.readFileSync(PREFERENCES_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.log('Error loading preferences:', error.message);
    }
    return defaultPreferences;
}

// Save preferences to file
function savePreferences(preferences) {
    try {
        fs.writeFileSync(PREFERENCES_FILE, JSON.stringify(preferences, null, 2));
        return true;
    } catch (error) {
        console.log('Error saving preferences:', error.message);
        return false;
    }
}

// API routes
app.get('/api/preferences', (req, res) => {
    const preferences = loadPreferences();
    res.json({
        success: true,
        preferences: preferences
    });
});

app.post('/api/preferences', (req, res) => {
    const newPreferences = req.body;

    //  validate preferences
    const validKeys = ['analytics', 'dataSharing', 'marketing', 'surveillanceAccess'];
    const isValid = Object.keys(newPreferences).every(key =>
        validKeys.includes(key) && typeof newPreferences[key] === 'boolean'
    );

    if (!isValid) {
        return res.json({
            success: false,
            message: 'Invalid preferences format'
        });
    }

    const saved = savePreferences(newPreferences);

    if (saved) {
        console.log('Preferences updated:', newPreferences);
        res.json({
            success: true,
            message: 'Preferences saved successfully'
        });
    } else {
        res.json({
            success: false,
            message: 'Error saving preferences'
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Current preferences:', loadPreferences());
});