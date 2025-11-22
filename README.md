# Spotify Artist Image Extractor

A web application that extracts high-quality artist images from Spotify links.

## Features

- Extract artist images from any Spotify artist URL
- Get all available image sizes (from thumbnail to full resolution)
- Clean, responsive user interface
- Works with various Spotify URL formats

## Setup

1. **Get Spotify API Credentials**
   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app to get your `Client ID` and `Client Secret`

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy the `.env` file and add your Spotify credentials:
   ```bash
   # In .env file
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

4. **Run the Application**
   ```bash
   # For development
   npm run dev
   
   # For production
   npm start
   ```

## Usage

1. Visit `http://localhost:3000` in your browser
2. Paste a Spotify artist URL (e.g., `https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX`)
3. Click "Extract Images"
4. View all available image sizes for the artist

## API Endpoint

- `POST /api/extract-artist-image`
  - Request body: `{ "spotifyUrl": "https://open.spotify.com/artist/..." }`
  - Response: Artist information and image URLs with dimensions

## Supported Spotify URL Formats

- `https://open.spotify.com/artist/{id}`
- `https://open.spotify.com/artist/{id}?si=...`
- `spotify:artist:{id}`

## How It Works

1. Extracts artist ID from the provided Spotify URL
2. Makes a request to Spotify's public API using your credentials
3. Retrieves artist data including all available images
4. Returns image URLs with their dimensions for use

## Technologies Used

- Node.js
- Express.js
- Spotify Web API
- HTML/CSS/JavaScript (frontend)
- Axios for HTTP requests