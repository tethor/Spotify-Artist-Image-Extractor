document.addEventListener('DOMContentLoaded', function() {
  const spotifyUrlInput = document.getElementById('spotifyUrl');
  const extractBtn = document.getElementById('extractBtn');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const resultSection = document.getElementById('resultSection');
  const imageContainer = document.getElementById('imageContainer');
  const artistNameElement = document.getElementById('artistName');
  const artistDetailsElement = document.getElementById('artistDetails');
  
  extractBtn.addEventListener('click', extractArtistImages);
  spotifyUrlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      extractArtistImages();
    }
  });
  
  async function extractArtistImages() {
    const spotifyUrl = spotifyUrlInput.value.trim();
    const selectedImageType = document.querySelector('input[name="imageType"]:checked').value;
    
    if (!spotifyUrl) {
      showError('Please enter a Spotify URL');
      return;
    }
    
    // Show loading, hide results and errors
    loadingElement.style.display = 'block';
    resultSection.style.display = 'none';
    errorElement.style.display = 'none';
    extractBtn.disabled = true;
    extractBtn.textContent = 'EXTRACTING...';
    
    try {
      const response = await fetch('/api/extract-artist-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          spotifyUrl,
          imageType: selectedImageType 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract artist images');
      }
      
      displayResults(data, selectedImageType);
    } catch (error) {
      console.error('Error:', error);
      showError(error.message || 'An error occurred while extracting artist images');
    } finally {
      loadingElement.style.display = 'none';
      extractBtn.disabled = false;
      extractBtn.textContent = 'EXTRACT IMAGE';
    }
  }
  
  function displayResults(artistData, imageType) {
    // Update artist info
    const artistName = artistData.artistName || artistData.artistId;
    artistNameElement.textContent = artistName;
    
    if (artistData.genres && artistData.followers) {
      artistDetailsElement.textContent = `GENRES: ${artistData.genres.slice(0, 3).join(', ').toUpperCase()} // FOLLOWERS: ${formatNumber(artistData.followers)}`;
    } else {
      artistDetailsElement.textContent = (artistData.note || 'Banner extracted from Spotify webpage').toUpperCase();
    }
    
    // Clear previous images
    imageContainer.innerHTML = '';
    
    // Show the selected image
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';
    
    const selectedImage = artistData.selectedImage;
    
    const img = document.createElement('img');
    img.src = selectedImage.url;
    img.alt = `${artistName} - ${imageType === 'mobile' ? 'Mobile' : 'Desktop'} image`;
    
    // Meta info
    const metaDiv = document.createElement('div');
    metaDiv.className = 'image-meta';
    
    let sizeInfo = 'UNKNOWN SIZE';
    if (selectedImage.width && selectedImage.height) {
      sizeInfo = `${selectedImage.width}x${selectedImage.height}PX`;
    }
    
    const typeLabel = imageType === 'mobile' ? 'MOBILE_PROFILE' : 'DESKTOP_BANNER';
    
    metaDiv.innerHTML = `
      <span>${typeLabel}</span>
      <span>${sizeInfo}</span>
    `;
    
    // Botón de descarga
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = 'DOWNLOAD_ASSET';
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = selectedImage.url;
      
      const cleanArtistName = artistName.replace(/[^a-zA-Z0-9]/g, '_');
      const dimensions = selectedImage.width && selectedImage.height ? 
        `_${selectedImage.width}x${selectedImage.height}` : '';
      const typeLabelFile = imageType === 'mobile' ? 'mobile_profile' : 'desktop_banner';
      
      link.download = `${cleanArtistName}${dimensions}_${typeLabelFile}.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    imageCard.appendChild(img);
    imageCard.appendChild(metaDiv);
    imageCard.appendChild(downloadBtn);
    
    // Method Badge
    const methodBadge = document.createElement('div');
    let methodClass = 'api';
    let methodText = 'SPOTIFY API';
    
    if (artistData.method !== 'spotify_api') {
      methodClass = 'puppeteer';
      methodText = 'WEB SCRAPER';
      if (artistData.usedFallback) {
        methodClass = 'fallback';
        methodText = 'LOCAL SCRAPER (FALLBACK)';
      }
    }
    
    methodBadge.className = `method-badge ${methodClass}`;
    methodBadge.textContent = `SOURCE: ${methodText}`;
    imageCard.appendChild(methodBadge);
    
    imageContainer.appendChild(imageCard);
    
    // Show the results section
    resultSection.style.display = 'block';
    
    // Scroll to results
    resultSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  function showError(message) {
    errorElement.textContent = `ERROR: ${message}`;
    errorElement.style.display = 'block';
  }
  
  function formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num;
  }
});
