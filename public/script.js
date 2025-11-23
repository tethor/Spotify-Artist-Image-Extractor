document.addEventListener('DOMContentLoaded', function () {
  const spotifyUrlInput = document.getElementById('spotifyUrl');
  const extractBtn = document.getElementById('extractBtn');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const resultSection = document.getElementById('resultSection');
  const imageContainer = document.getElementById('imageContainer');
  const artistNameElement = document.getElementById('artistName');
  const artistDetailsElement = document.getElementById('artistDetails');
  const langBtn = document.getElementById('langBtn');
  const exampleUrl = document.getElementById('exampleUrl');

  // Translations
  const translations = {
    en: {
      title: 'Spotify<br>Extractor',
      subtitle: 'Image Extraction Tool',
      input_placeholder: 'PASTE URL OR TYPE ARTIST NAME...',
      extract_btn: 'EXTRACT IMAGE',
      mobile_option: 'Mobile (Profile)',
      desktop_option: 'Desktop (Banner)',
      instructions_title: '// INSTRUCTIONS',
      instr_1: 'COPY URL OR TYPE ARTIST NAME',
      instr_2: 'PASTE/TYPE INTO INPUT FIELD',
      instr_3: 'SELECT ASSET TYPE',
      instr_4: 'EXECUTE EXTRACTION',
      note_label: 'NOTE:',
      note_text: 'DESKTOP EXTRACTION USES HEADLESS BROWSER. MAY BE SLOWER.',
      example_label: 'EXAMPLE URL:',
      loading: '// PROCESSING REQUEST...',
      error_url: 'Please enter a URL or Artist Name',
      extracting: 'EXTRACTING...',
      download_asset: 'DOWNLOAD IMAGE',
      mobile_profile: 'MOBILE_PROFILE',
      desktop_banner: 'DESKTOP_BANNER',
      unknown_size: 'UNKNOWN SIZE',
      source: 'SOURCE',
      spotify_api: 'SPOTIFY API',
      web_scraper: 'WEB SCRAPER',
      local_fallback: 'LOCAL SCRAPER (FALLBACK)',
      genres: 'GENRES',
      followers: 'FOLLOWERS',
      brand_tag: 'BY POCAPAY GO // FREE K-POP TOOLS',
      brought_by: 'BROUGHT TO YOU BY',
      follow_us: 'FOLLOW US',
      footer_tagline: 'FREE TOOLS FOR THE K-POP COMMUNITY 💜',
      modal_title: '// WAIT!',
      modal_subtitle: 'GET EXCLUSIVE ACCESS',
      modal_intro: 'FOLLOW @POCAPAY_MX ON INSTAGRAM FOR:',
      benefit_1: '💿 OFFICIAL K-POP ALBUMS',
      benefit_2: '🎁 EXCLUSIVE PRE-ORDERS',
      benefit_3: '💰 DISCOUNTS & PROMOTIONS',
      benefit_4: '📦 SHIPPING ACROSS MEXICO',
      modal_cta: 'FOLLOW @POCAPAY_MX',
      modal_dont_show: "DON'T SHOW THIS AGAIN"
    },
    es: {
      title: 'Spotify<br>Extractor',
      subtitle: 'Herramienta de Extracción',
      input_placeholder: 'ESCRIBE NOMBRE DEL ARTISTA O PEGA URL...',
      extract_btn: 'EXTRAER IMAGEN',
      mobile_option: 'Móvil (Perfil)',
      desktop_option: 'Escritorio (Banner)',
      instructions_title: '// INSTRUCCIONES',
      instr_1: 'COPIA URL O ESCRIBE NOMBRE ARTISTA',
      instr_2: 'PEGA/ESCRIBE EN EL CAMPO',
      instr_3: 'SELECCIONA TIPO DE ASSET',
      instr_4: 'EJECUTAR EXTRACCIÓN',
      note_label: 'NOTA:',
      note_text: 'EXTRACCIÓN DE ESCRITORIO USA NAVEGADOR HEADLESS. PUEDE SER MÁS LENTO.',
      example_label: 'URL EJEMPLO:',
      loading: '// PROCESANDO PETICIÓN...',
      error_url: 'Por favor ingresa una URL o Nombre',
      extracting: 'EXTRAYENDO...',
      download_asset: 'DESCARGAR IMAGEN',
      mobile_profile: 'PERFIL_MÓVIL',
      desktop_banner: 'BANNER_ESCRITORIO',
      unknown_size: 'TAMAÑO DESCONOCIDO',
      source: 'FUENTE',
      spotify_api: 'API SPOTIFY',
      web_scraper: 'WEB SCRAPER',
      local_fallback: 'SCRAPER LOCAL (FALLBACK)',
      genres: 'GÉNEROS',
      followers: 'SEGUIDORES',
      brand_tag: 'POR POCAPAY GO // HERRAMIENTAS K-POP GRATIS',
      brought_by: 'TRAÍDO POR',
      follow_us: 'SÍGUENOS',
      footer_tagline: 'HERRAMIENTAS GRATIS PARA LA COMUNIDAD K-POP 💜',
      modal_title: '// ¡ESPERA!',
      modal_subtitle: 'OBTÉN ACCESO EXCLUSIVO',
      modal_intro: 'SÍGUENOS EN INSTAGRAM @POCAPAY_MX PARA:',
      benefit_1: '💿 ÁLBUMES K-POP OFICIALES',
      benefit_2: '🎁 PREVENTAS EXCLUSIVAS',
      benefit_3: '💰 DESCUENTOS Y PROMOCIONES',
      benefit_4: '📦 ENVÍOS A TODO MÉXICO',
      modal_cta: 'SEGUIR @POCAPAY_MX',
      modal_dont_show: 'NO MOSTRAR DE NUEVO'
    }
  };

  let currentLang = 'es';

  // Language Switcher Logic
  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'es' : 'en';
    updateLanguage();
  });

  function updateLanguage() {
    const t = translations[currentLang];

    // Update text content for elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (key === 'title') {
          el.innerHTML = t[key]; // Handle HTML in title
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key]) {
        el.placeholder = t[key];
      }
    });

    // Update button text if currently extracting
    if (extractBtn.disabled) {
      extractBtn.textContent = t.extracting;
    } else {
      extractBtn.textContent = t.extract_btn;
    }
  }

  // Example URL click to copy
  exampleUrl.addEventListener('click', () => {
    const url = exampleUrl.textContent;
    navigator.clipboard.writeText(url)
      .then(() => {
        const originalText = exampleUrl.textContent;
        exampleUrl.textContent = 'COPIED TO CLIPBOARD!';
        setTimeout(() => {
          exampleUrl.textContent = originalText;
        }, 1500);
      })
      .catch(err => {
        // Fallback para HTTP o navegadores sin soporte
        console.warn('Clipboard API failed:', err);
        const originalText = exampleUrl.textContent;
        exampleUrl.textContent = 'URL READY TO COPY!';
        setTimeout(() => {
          exampleUrl.textContent = originalText;
        }, 1500);
      });

    // Also fill input
    spotifyUrlInput.value = url;
  });

  // Initialize language on page load
  updateLanguage();

  extractBtn.addEventListener('click', extractArtistImages);
  spotifyUrlInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      extractArtistImages();
    }
  });

  async function extractArtistImages() {
    const spotifyUrl = spotifyUrlInput.value.trim();
    const selectedImageType = document.querySelector('input[name="imageType"]:checked').value;

    if (!spotifyUrl) {
      showError(translations[currentLang].error_url);
      return;
    }

    // Validación básica mejorada
    const isUrl = spotifyUrl.includes('spotify.com') || spotifyUrl.includes('spotify:');
    const isSearch = !isUrl && spotifyUrl.length > 0;

    if (!isUrl && !isSearch) {
      const errorMsg = currentLang === 'es'
        ? 'Por favor ingresa una URL de Spotify válida o nombre de artista'
        : 'Please enter a valid Spotify URL or artist name';
      showError(errorMsg);
      return;
    }

    // Show loading with descriptive message based on type
    const loadingMsg = selectedImageType === 'mobile'
      ? (currentLang === 'es' ? '// OBTENIENDO IMAGEN DE PERFIL...' : '// GETTING PROFILE IMAGE...')
      : (currentLang === 'es' ? '// EXTRAYENDO BANNER (PUEDE TARDAR)...' : '// EXTRACTING BANNER (MAY TAKE A WHILE)...');

    loadingElement.textContent = loadingMsg;
    loadingElement.style.display = 'block';
    resultSection.style.display = 'none';
    errorElement.style.display = 'none';
    extractBtn.disabled = true;
    extractBtn.textContent = translations[currentLang].extracting;

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
      extractBtn.textContent = translations[currentLang].extract_btn;
    }
  }

  function displayResults(artistData, imageType) {
    const t = translations[currentLang];
    // Update artist info
    const artistName = artistData.artistName || artistData.artistId;
    artistNameElement.textContent = artistName;

    if (artistData.genres && artistData.followers) {
      artistDetailsElement.textContent = `${t.genres}: ${artistData.genres.slice(0, 3).join(', ').toUpperCase()} // ${t.followers}: ${formatNumber(artistData.followers)}`;
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

    let sizeInfo = t.unknown_size;
    if (selectedImage.width && selectedImage.height) {
      sizeInfo = `${selectedImage.width}x${selectedImage.height}PX`;
    }

    const typeLabel = imageType === 'mobile' ? t.mobile_profile : t.desktop_banner;

    metaDiv.innerHTML = `
      <span>${typeLabel}</span>
      <span>${sizeInfo}</span>
    `;

    // Botón de descarga
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = t.download_asset;
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
    let methodText = t.spotify_api;

    if (artistData.method !== 'spotify_api') {
      methodClass = 'puppeteer';
      methodText = t.web_scraper;
      if (artistData.usedFallback) {
        methodClass = 'fallback';
        methodText = t.local_fallback;
      }
    }

    methodBadge.className = `method-badge ${methodClass}`;
    methodBadge.textContent = `${t.source}: ${methodText}`;
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

  // ============================================
  // INSTAGRAM ENGAGEMENT MODAL LOGIC
  // ============================================

  const modal = document.getElementById('instagramModal');
  const modalClose = document.getElementById('modalClose');
  const modalCTA = document.getElementById('modalCTA');
  const dontShowAgain = document.getElementById('dontShowAgain');

  const MODAL_STORAGE_KEY = 'instagram_modal_dismissed';
  let modalShown = false;
  let exitIntentTriggered = false;
  let modalTimeout = null; // Track timeout to prevent multiple modals
  let exitIntentDebounce = null; // Debounce for exit-intent

  // Check if user has dismissed the modal permanently
  function shouldShowModal() {
    return !localStorage.getItem(MODAL_STORAGE_KEY) && !modalShown;
  }

  // Show modal with animation
  function showModal() {
    if (shouldShowModal()) {
      modal.classList.add('show');
      modalShown = true;
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  }

  // Hide modal
  function hideModal() {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling

    // Save preference if checkbox is checked
    if (dontShowAgain.checked) {
      localStorage.setItem(MODAL_STORAGE_KEY, 'true');
    }
  }

  // Exit-Intent Detection with debounce (modal disabled for exit-intent)
  function handleMouseLeave(e) {
    // Debounce to prevent multiple triggers
    if (exitIntentDebounce) return;

    // Trigger when mouse moves to top of viewport (leaving page)
    if (e.clientY < 10 && !exitIntentTriggered && shouldShowModal()) {
      exitIntentDebounce = setTimeout(() => {
        exitIntentDebounce = null;
      }, 100);

      // showModal(); // Disabled: modal now only opens after image extraction
      exitIntentTriggered = true;
    }
  }

  // Post-Extraction Success Trigger
  const originalDisplayResults = displayResults;
  displayResults = function (artistData, imageType) {
    originalDisplayResults(artistData, imageType);

    // Clear any existing timeout to prevent multiple modals
    if (modalTimeout) {
      clearTimeout(modalTimeout);
    }

    // Show modal 3 seconds after successful extraction
    if (shouldShowModal()) {
      modalTimeout = setTimeout(() => {
        showModal();
        modalTimeout = null;
      }, 3000);
    }
  };

  // Event Listeners
  document.addEventListener('mouseleave', handleMouseLeave);

  // Mobile-friendly trigger (modal disabled for scroll)
  // let scrollTriggered = false;
  // window.addEventListener('scroll', () => {
  //   if (scrollTriggered || !shouldShowModal()) return;
  //
  //   const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  //
  //   // Trigger at 50% scroll on mobile devices
  //   if (scrollPercent > 50 && window.innerWidth <= 768) {
  //     scrollTriggered = true;
  //     setTimeout(() => {
  //       showModal(); // Disabled: modal now only opens after image extraction
  //     }, 1000); // Small delay after scroll threshold
  //   }
  // });

  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });

  // Close modal on close button
  modalClose.addEventListener('click', hideModal);

  // Track CTA click (optional: could add analytics here)
  modalCTA.addEventListener('click', () => {
    // Modal will stay open, user opens Instagram in new tab
    // They can manually close it after
  });
});
