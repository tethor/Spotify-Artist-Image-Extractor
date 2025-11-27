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
      subtitle: 'Free Image Extraction Tool',
      input_placeholder: 'TYPE ARTIST NAME OR PASTE URL...',
      extract_btn: 'EXTRACT IMAGE',
      mobile_option: 'Mobile (Profile)',
      desktop_option: 'Desktop (Banner)',
      instructions_title: '// INSTRUCTIONS',
      instr_1: 'TYPE ARTIST NAME OR PASTE URL...',
      instr_2: 'SELECT IMAGE TYPE',
      instr_3: 'EXECUTE EXTRACTION',
      note_label: 'NOTE:',
      note_text: 'DESKTOP EXTRACTION IS MORE POWERFUL BUT MAY TAKE A FEW SECONDS LONGER. PLEASE BE PATIENT!',
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
      brand_tag: 'BY POCAPAY GO',
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
      modal_dont_show: "DON'T SHOW THIS AGAIN",
      // New translations for meta tags
      page_title: 'SPOTIFY_EXTRACTOR // V1.0',
      og_title: 'Spotify Extractor // Image Extraction Tool',
      og_description: 'Extract high-quality artist images (Profile and Banner) from Spotify. Neo-Brutalist Design. Free and Open Source.',
      twitter_title: 'Spotify Extractor // Image Extraction Tool',
      twitter_description: 'Extract artist images from Spotify. Mobile and Desktop Support.',
      seo_keywords: 'spotify download image, spotify artist image, spotify banner extractor, download spotify cover, spotify tools, pocapay, kpop',
      meta_description: 'Extract high-quality artist images from Spotify. Free tool by POCAPAY GO for the K-POP community.',
      loading_mobile: '// GETTING PROFILE IMAGE...',
      loading_desktop: '// EXTRACTING BANNER (MAY TAKE A WHILE)...',
      error_invalid_url: 'Please enter a valid Spotify URL or artist name',
      clipboard_copied: 'COPIED TO CLIPBOARD!',
      clipboard_ready: 'URL READY TO COPY!',
      image_alt_mobile: 'Mobile image',
      image_alt_desktop: 'Desktop image',
      banner_fallback: 'BANNER',
      artist_search_btn: 'Do you like this artist? Search their albums here'
    },
    es: {
      title: 'Spotify<br>Extractor',
      subtitle: 'Herramienta de Extracción gratis',
      input_placeholder: 'ESCRIBE NOMBRE DEL ARTISTA O PEGA URL...',
      extract_btn: 'EXTRAER IMAGEN',
      mobile_option: 'Móvil (Perfil)',
      desktop_option: 'Escritorio (Banner)',
      instructions_title: '// INSTRUCCIONES',
      instr_1: 'ESCRIBE NOMBRE DEL ARTISTA O PEGA URL...',
      instr_2: 'SELECCIONA TIPO DE IMAGEN',
      instr_3: 'EJECUTAR EXTRACCIÓN',
      note_label: 'NOTA:',
      note_text: 'LA EXTRACCIÓN DE ESCRITORIO ES MÁS POTENTE PERO PUEDE TARDAR UNOS SEGUNDOS MÁS. ¡TEN PACIENCIA!.',
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
      brand_tag: 'POR POCAPAY GO',
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
      modal_dont_show: 'NO MOSTRAR DE NUEVO',
      // Nuevas traducciones para meta tags
      page_title: 'SPOTIFY_EXTRACTOR // V1.0',
      og_title: 'Spotify Extractor // Herramienta de Extracción de Imágenes',
      og_description: 'Extrae imágenes de artistas en alta calidad (Perfil y Banner) desde Spotify. Diseño Neo-Brutalista. Gratis y Open Source.',
      twitter_title: 'Spotify Extractor // Herramienta de Extracción',
      twitter_description: 'Extrae imágenes de artistas desde Spotify. Soporte Móvil y Escritorio.',
      seo_keywords: 'spotify descargar imagen, spotify imagen artista, spotify banner extractor, descargar portada spotify, herramientas spotify, pocapay, kpop',
      meta_description: 'Extrae imágenes de artistas en alta calidad desde Spotify. Herramienta gratuita por POCAPAY GO para la comunidad K-POP.',
      loading_mobile: '// OBTENIENDO IMAGEN DE PERFIL...',
      loading_desktop: '// EXTRAYENDO BANNER (PUEDE TARDAR)...',
      error_invalid_url: 'Por favor ingresa una URL de Spotify válida o nombre de artista',
      clipboard_copied: '¡COPIADO AL PORTAPAPELES!',
      clipboard_ready: '¡URL LISTA PARA COPIAR!',
      image_alt_mobile: 'Imagen Móvil',
      image_alt_desktop: 'Imagen Escritorio',
      banner_fallback: 'BANNER',
      artist_search_btn: '¿Te gusta este artista? Busca sus álbumes aquí'
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

    // Update meta tags content
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (t[key]) {
        el.textContent = t[key];
        // Also update the document title
        document.title = t[key];
      }
    });

    document.querySelectorAll('[data-i18n-og-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-og-title');
      if (t[key]) {
        el.setAttribute('content', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-og-desc]').forEach(el => {
      const key = el.getAttribute('data-i18n-og-desc');
      if (t[key]) {
        el.setAttribute('content', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-twitter-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-twitter-title');
      if (t[key]) {
        el.setAttribute('content', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-twitter-desc]').forEach(el => {
      const key = el.getAttribute('data-i18n-twitter-desc');
      if (t[key]) {
        el.setAttribute('content', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-desc]').forEach(el => {
      const key = el.getAttribute('data-i18n-desc');
      if (t[key]) {
        el.setAttribute('content', t[key]);
      }
    });

    document.querySelectorAll('[data-i18n-keywords]').forEach(el => {
      const key = el.getAttribute('data-i18n-keywords');
      if (t[key]) {
        el.setAttribute('content', t[key]);
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
  }

  // Example URL click to copy
  exampleUrl.addEventListener('click', () => {
    const url = exampleUrl.textContent;
    navigator.clipboard.writeText(url)
      .then(() => {
        const originalText = exampleUrl.textContent;
        exampleUrl.textContent = translations[currentLang].clipboard_copied;
        setTimeout(() => {
          exampleUrl.textContent = originalText;
        }, 1500);
      })
      .catch(err => {
        // Fallback para HTTP o navegadores sin soporte
        console.warn('Clipboard API failed:', err);
        const originalText = exampleUrl.textContent;
        exampleUrl.textContent = translations[currentLang].clipboard_ready;
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
      showError(translations[currentLang].error_invalid_url);
      return;
    }

    // Show loading with descriptive message based on type
    const loadingMsg = selectedImageType === 'mobile'
      ? translations[currentLang].loading_mobile
      : translations[currentLang].loading_desktop;

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
      artistDetailsElement.textContent = (artistData.note || t.banner_fallback).toUpperCase();
    }

    // Clear previous images
    imageContainer.innerHTML = '';

    // Show the selected image
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';

    const selectedImage = artistData.selectedImage;

    const img = document.createElement('img');
    img.src = selectedImage.url;
    img.alt = `${artistName} - ${imageType === 'mobile' ? t.image_alt_mobile : t.image_alt_desktop}`;

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

    // Nuevo botón para buscar álbumes
    const searchAlbumsBtn = document.createElement('a');
    searchAlbumsBtn.className = 'search-albums-btn';
    searchAlbumsBtn.textContent = t.artist_search_btn;
    searchAlbumsBtn.href = `https://pocapay.com/artistas/${encodeURIComponent(artistName)}`;
    searchAlbumsBtn.target = '_blank';
    
    imageCard.appendChild(searchAlbumsBtn);

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

  // Mobile Instructions Toggle
  const instructions = document.querySelector('.instructions');
  if (instructions && window.innerWidth <= 319) {
    const instructionsTitle = instructions.querySelector('h3') || instructions.querySelector('h2') || instructions.firstElementChild;

    if (instructionsTitle) {
      instructionsTitle.style.cursor = 'pointer';
      instructionsTitle.addEventListener('click', () => {
        instructions.classList.toggle('show');
        const toggleIcon = instructionsTitle.querySelector('.toggle-icon') || document.createElement('span');
        if (!toggleIcon.classList.contains('toggle-icon')) {
          toggleIcon.className = 'toggle-icon';
          toggleIcon.style.marginLeft = '8px';
          if (!instructionsTitle.querySelector('.toggle-icon')) {
            toggleIcon.textContent = instructions.classList.contains('show') ? '-' : '+';
            instructionsTitle.appendChild(toggleIcon);
          }
        }
        toggleIcon.textContent = instructions.classList.contains('show') ? '-' : '+';
      });

      // Initially collapsed on ultra small devices
      if (!instructions.classList.contains('show')) {
        instructions.style.maxHeight = '40px';
      }
    }
  }

  // Event Listeners
  document.addEventListener('mouseleave', handleMouseLeave);

  // Mobile-friendly trigger logic removed as it was commented out

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
