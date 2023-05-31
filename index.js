// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require("body-parser");
const app = express();
const jwt = require('jsonwebtoken');
const port = 3040;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

// Zoom API credentials
const apiKey = 'vGhZN-QYScSi9T7RqoKA-w';
const apiSecret = 'S8nynxymN59ZWPsOZg8HQz3ZmUp98ar0MW7o';

app.get('/join', async (req, res) => {
  try {
    // Create Zoom meeting
    const meetingOptions = {
      topic: 'Live Class',
      type: 2, // Scheduled meeting
      start_time: '2023-06-01T10:00:00Z',
      duration: 60, // Duration in minutes
      settings: {
        host_video: true,
        participant_video: true,
      },
    };

    const jwtToken = generateJwtToken(apiKey, apiSecret);

    const createMeetingResponse = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      meetingOptions,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const meetingId = createMeetingResponse.data.id;

    // Generate join URL
    const username = 'hemant26122002@gmail.com'; // Replace with participant's email or username
    const joinUrl = `https://zoom.us/j/${meetingId}?uname=${encodeURIComponent(username)}`;

    res.json({ joinUrl });
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    res.status(500).json({ error: 'Failed to create Zoom meeting' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function generateJwtToken(apiKey, apiSecret) {
  const payload = {
    iss: apiKey,
    exp: Date.now() + 60 * 60 * 1000, // 1 hour expiration
  };

  const token = jwt.sign(payload, apiSecret);
  return token;
}
