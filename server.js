const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Spotify API credentials - these should be set in your .env file
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  console.warn('Spotify API credentials not found. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your .env file.');
}

// Get Spotify API access token
async function getSpotifyToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify API credentials are not configured');
  }
  
  const tokenUrl = 'https://accounts.spotify.com/api/token';
  const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  try {
    const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error.message);
    throw error;
  }
}

// Extract artist ID from Spotify URL
function extractArtistId(spotifyUrl) {
  // Handle various Spotify URL formats
  const patterns = [
    /spotify\.com\/artist\/([a-zA-Z0-9]+)/,
    /open\.spotify\.com\/artist\/([a-zA-Z0-9]+)/,
    /spotify:artist:([a-zA-Z0-9]+)/
  ];
  
  for (const pattern of patterns) {
    const match = spotifyUrl.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

// Get artist data from Spotify
async function getArtistData(artistId, token) {
  const url = `https://api.spotify.com/v1/artists/${artistId}`;
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting artist data:', error.message);
    throw error;
  }
}

// API endpoint to extract artist image
app.post('/api/extract-artist-image', async (req, res) => {
  try {
    const { spotifyUrl } = req.body;
    
    if (!spotifyUrl) {
      return res.status(400).json({ error: 'Spotify URL is required' });
    }
    
    // Extract artist ID from URL
    const artistId = extractArtistId(spotifyUrl);
    
    if (!artistId) {
      return res.status(400).json({ error: 'Invalid Spotify URL format' });
    }
    
    // Get access token
    const token = await getSpotifyToken();
    
    // Get artist data
    const artistData = await getArtistData(artistId, token);
    
    // Extract image (using the highest resolution available)
    const images = artistData.images;
    if (!images || images.length === 0) {
      return res.status(404).json({ error: 'No images found for this artist' });
    }
    
    // Return the largest image (first in array as Spotify returns them in descending order)
    const largestImage = images[0];
    const smallestImage = images[images.length - 1];
    
    res.json({
      artistName: artistData.name,
      artistId: artistData.id,
      images: images, // Return all available sizes
      largestImage: largestImage,
      smallestImage: smallestImage,
      genres: artistData.genres,
      followers: artistData.followers.total
    });
    
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Failed to extract artist image' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});

module.exports = app;