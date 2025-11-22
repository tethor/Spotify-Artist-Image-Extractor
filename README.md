# 🎵 Spotify Artist Image Extractor

A web application that extracts high-quality artist images from Spotify links with two modes: **Mobile** (profile) and **Desktop** (banner).

> **Note**: This is an independent tool for personal use and is **not affiliated with Spotify, Inc.**

## ✨ Features

- **Two extraction modes**:
  - 📱 **Mobile**: Extracts artist profile picture via Spotify API (square format).
  - 💻 **Desktop**: Extracts artist banner/header from Spotify webpage via Puppeteer (wide format).
- **No authentication** required for end users.
- **Fast extraction** via Spotify Web API (Mobile mode).
- **Accurate banner extraction** via Puppeteer web scraping (Desktop mode).
- **Responsive, clean** user interface.
- **Direct download** with descriptive filenames.
- **Configurable Browserless.io support** for production environments.

## 🚀 How to Use

1.  Visit `http://localhost:3000` in your browser.
2.  Paste a Spotify artist URL (e.g., `https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX`).
3.  Select the desired image type:
    - **📱 Mobile**: Extracts the square profile picture.
    - **💻 Desktop**: Extracts the wide banner/header image.
4.  Click "**Extract Image**".
5.  Click "**Download Image**" to save the file.

## 🛠️ Setup and Installation

### 1. Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### 2. Get Spotify API Credentials

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2.  Create a new app to get your `Client ID` and `Client Secret`.
3.  No need to set a redirect URI (the app uses the Client Credentials flow).

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```bash
# Required: Spotify API credentials from the developer dashboard
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Optional: Browserless.io token for faster Puppeteer in production
# Get one from https://www.browserless.io/ (free tier available)
# If not provided, the app will use a local Puppeteer instance.
# BROWSERLESS_TOKEN=your_real_token_here
```

### 5. Run the Application

```bash
# For development (with auto-reload)
npm run dev

# For production
npm start
```

The server will start at `http://localhost:3000`.

## 📝 Usage Notes

> - This tool is designed for personal use.
> - Please respect Spotify's terms of service.
> - Banner images are copyright of the respective artists and labels.
> - See the legal page on the site for full terms and disclaimers.

## ⚙️ Performance Notes

The **Desktop/Banner mode** uses Puppeteer, which has the following behavior:
- **First run**: Downloads a compatible version of Chrome (~300MB), which may take 30-60 seconds.
- **Subsequent runs**: Much faster (5-10 seconds).
- **With Browserless.io**: Fastest option (3-5 seconds) with no local downloads.

## 📡 API Endpoint

### `POST /api/extract-artist-image`

Extracts an artist's image based on the selected mode.

**Request Body:**
```json
{
  "spotifyUrl": "https://open.spotify.com/artist/3Nrfpe0tUJi4K4DXYWgMUX",
  "imageType": "mobile"
}
```
*(`imageType` can be `"mobile"` or `"desktop"`)*

<details>
<summary>Click to see example API responses</summary>

**Response (Mobile - Spotify API):**
```json
{
  "artistName": "BTS",
  "artistId": "3Nrfpe0tUJi4K4DXYWgMUX",
  "selectedImage": {
    "url": "https://i.scdn.co/image/...",
    "width": 640,
    "height": 640
  },
  "allImages": [...],
  "method": "spotify_api",
  "genres": ["k-pop", ...],
  "followers": {"total": 12345678}
}
```

**Response (Desktop - Puppeteer):**
```json
{
  "artistName": "3Nrfpe0tUJi4K4DXYWgMUX",
  "artistId": "3Nrfpe0tUJi4K4DXYWgMUX",
  "selectedImage": {
    "url": "https://image-cdn-ak.spotifycdn.com/image/ab67618600000194...",
    "width": null,
    "height": null
  },
  "method": "puppeteer_scraper",
  "browserType": "Local Chrome",
  "usedLocalFallback": true
}
```
</details>

## 🔗 Supported URL Formats

- `https://open.spotify.com/artist/{id}`
- `https://open.spotify.com/artist/{id}?si=...`
- `spotify:artist:{id}`

## 🔧 Troubleshooting

-   **Desktop/Banner mode fails**:
    -   On the first run, wait for the Chrome download to complete.
    -   Check your internet connection.
    -   If using Browserless, ensure your token is valid. If not, remove it from the `.env` file to use the local Puppeteer instance.
-   **Mobile mode fails**:
    -   Verify your Spotify `Client ID` and `Client Secret` in the `.env` file.
    -   You may have been rate-limited by the API. Wait and try again later.
-   **General issues**:
    -   Restart the server (`npm start` or `npm run dev`).
    -   Check the console for error messages.
    -   Update dependencies with `npm update`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## 📜 License and Disclaimer

This project is licensed under the **GNU General Public License v3.0**.

> This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
>
> This program is distributed in the hope that it will be useful, but **without any warranty**; without even the implied warranty of **merchantability or fitness for a particular purpose**. See the GNU General Public License for more details.
>
> You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

**Disclaimer**: This tool is provided "as is" for educational and personal use. The authors assume no responsibility for any misuse of this tool or violation of Spotify's terms of service. Users are solely responsible for complying with all applicable laws and terms of service.

---
*The Spotify name, logo, and brand are registered trademarks of Spotify AB.*