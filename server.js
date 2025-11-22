const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { extractBannerWithPuppeteer } = require('./puppeteer-banner');
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

// API endpoint to extract artist image (híbrido: API para mobile, Puppeteer para desktop)
app.post('/api/extract-artist-image', async (req, res) => {
  try {
    const { spotifyUrl, imageType = 'mobile' } = req.body;
    
    if (!spotifyUrl) {
      return res.status(400).json({ error: 'Spotify URL is required' });
    }
    
    // Extraer artist ID
    const artistId = extractArtistId(spotifyUrl);
    
    if (!artistId) {
      return res.status(400).json({ error: 'Invalid Spotify URL format' });
    }
    
    // MODO MOBILE: Usar la API de Spotify (imagen de perfil cuadrada)
    if (imageType === 'mobile') {
      console.log('Using Spotify API for mobile image');
      const token = await getSpotifyToken();
      const artistData = await getArtistData(artistId, token);
      
      const images = artistData.images;
      if (!images || images.length === 0) {
        return res.status(404).json({ error: 'No images found for this artist' });
      }
      
      // Seleccionar la imagen más cuadrada (ideal para mobile)
      let selectedImage = images.reduce((prev, current) => {
        if (!prev) return current;
        const prevDiff = Math.abs(prev.width - prev.height);
        const currentDiff = Math.abs(current.width - current.height);
        return currentDiff < prevDiff ? current : prev;
      }, null);
      
      res.json({
        artistName: artistData.name,
        artistId: artistData.id,
        selectedImage: selectedImage,
        allImages: images,
        method: 'spotify_api',
        genres: artistData.genres,
        followers: artistData.followers.total
      });
    } 
    // MODO DESKTOP: Usar Puppeteer para extraer el banner de la página
    else if (imageType === 'desktop') {
      console.log('Using Puppeteer for desktop banner extraction');
      
      let artistUrl = spotifyUrl;
      // Normalizar URL si no tiene el formato completo
      if (!artistUrl.includes('spotify.com')) {
        artistUrl = `https://open.spotify.com/artist/${artistId}`;
      }
      
      // VERIFICAR SI USAR BROWSERLESS O LOCAL
      const browserlessToken = process.env.BROWSERLESS_TOKEN;
      const isValidToken = browserlessToken && 
                           browserlessToken !== 'your_browserless_token_here' && 
                           browserlessToken.trim() !== '';
      
      let bannerResult;
      let usedFallback = false;
      let browserType = 'Unknown';
      
      if (!isValidToken) {
        // SIN TOKEN VÁLIDO: Usar Puppeteer local directamente
        console.log('⚠️ No valid Browserless.io token found, using local Puppeteer');
        console.log('   (To use Browserless, edit .env and set BROWSERLESS_TOKEN=your_real_token)');
        usedFallback = true;
        browserType = 'Local Chrome';
        
        // Forzar modo local
        process.env.BROWSERLESS_TOKEN = '';
        
        try {
          bannerResult = await extractBannerWithPuppeteer(artistUrl);
          if (bannerResult) {
            bannerResult.browserType = browserType;
          }
        } catch (error) {
          console.error('❌ Local Puppeteer failed:', error.message);
          return res.status(500).json({ 
            error: 'Local Puppeteer failed to extract banner',
            details: error.message,
            suggestion: 'Make sure you have Chrome/Chromium installed or an internet connection for first run download'
          });
        }
        
      } else {
        // CON TOKEN: Intentar Browserless.io primero
        console.log('✅ Valid Browserless.io token found, trying Browserless.io...');
        
        try {
          bannerResult = await extractBannerWithPuppeteer(artistUrl);
          browserType = 'Browserless.io';
        } catch (error) {
          console.error('❌ Browserless.io failed:', error.message);
          
          // Si falla por auth, intentar local como fallback
          if (error.message && error.message.includes('401')) {
            console.log('🔄 Browserless.io auth failed, trying local Puppeteer fallback...');
            
            // Guardar token para restaurarlo después
            const savedToken = process.env.BROWSERLESS_TOKEN;
            process.env.BROWSERLESS_TOKEN = ''; // Forzar local
            
            try {
              bannerResult = await extractBannerWithPuppeteer(artistUrl);
              usedFallback = true;
              browserType = 'Local Chrome (fallback)';
              console.log('✅ Fallback to local Puppeteer successful!');
              
              // Restaurar token
              process.env.BROWSERLESS_TOKEN = savedToken;
            } catch (fallbackError) {
              console.error('❌ Local Puppeteer fallback also failed:', fallbackError.message);
              // Restaurar token
              process.env.BROWSERLESS_TOKEN = savedToken;
              
              return res.status(500).json({ 
                error: 'Both Browserless.io and local Puppeteer failed',
                details: `Browserless: ${error.message} | Local: ${fallbackError.message}`,
                suggestion: 'Check your Browserless token or Chrome installation'
              });
            }
          } else {
            // Otro error distinto a auth
            return res.status(500).json({ 
              error: 'Browserless.io failed to extract banner',
              details: error.message
            });
          }
        }
      }
      
      if (!bannerResult) {
        return res.status(404).json({ error: 'No banner image found on this artist page' });
      }
      
      res.json({
        artistName: artistId, // No tenemos el nombre sin la API, usamos ID
        artistId: artistId,
        selectedImage: {
          url: bannerResult.url,
          width: null, // No sabemos dimensiones sin descargar
          height: null
        },
        allImages: [{ url: bannerResult.url }],
        method: 'puppeteer_scraper',
        note: 'Banner extracted from Spotify webpage',
        browserType: browserType || bannerResult.browserType,
        usedLocalFallback: usedFallback // Informar si se usó fallback local
      });
    } else {
      return res.status(400).json({ error: 'Invalid imageType. Use "mobile" or "desktop"' });
    }
    
  } catch (error) {
    console.error('Error processing request:', error.message);
    res.status(500).json({ error: 'Failed to extract artist image', details: error.message });
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