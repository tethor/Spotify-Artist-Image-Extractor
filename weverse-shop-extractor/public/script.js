document.addEventListener('DOMContentLoaded', function () {
  const searchQueryInput = document.getElementById('searchQuery');
  const extractBtn = document.getElementById('extractBtn');
  const loadingElement = document.getElementById('loading');
  const errorElement = document.getElementById('error');
  const resultSection = document.getElementById('resultSection');
  const imageContainer = document.getElementById('imageContainer');
  const productNameElement = document.getElementById('productName');
  const productDetailsElement = document.getElementById('productDetails');
  const productLinkElement = document.getElementById('productLink');
  const langBtn = document.getElementById('langBtn');
  const exampleQuery = document.getElementById('exampleQuery');

  // Translations
  const translations = {
    en: {
      title: 'Weverse Shop<br>Extractor',
      subtitle: 'Product Image Extraction Tool',
      input_placeholder: 'SEARCH PRODUCT (E.G: BLACKPINK LIGHTSTICK) OR PRODUCT URL...',
      extract_btn: 'EXTRACT IMAGE',
      instructions_title: '// INSTRUCTIONS',
      instr_1: 'TYPE THE PRODUCT NAME YOU ARE LOOKING FOR...',
      instr_2: 'EXAMPLE: "BLACKPINK LIGHTSTICK" OR PRODUCT URL',
      instr_3: 'EXECUTE EXTRACTION',
      note_label: 'NOTE:',
      note_text: 'EXTRACTION USES HEADLESS BROWSER. MAY BE SLOWER.',
      example_label: 'EXAMPLE:',
      loading: '// PROCESSING REQUEST...',
      loading_search: '// SEARCHING PRODUCT...',
      loading_extract: '// EXTRACTING IMAGE (MAY TAKE A WHILE)...',
      error_query: 'Please enter a product search query',
      extracting: 'EXTRACTING...',
      download_asset: 'DOWNLOAD IMAGE',
      product_image: 'PRODUCT_IMAGE',
      unknown_size: 'UNKNOWN SIZE',
      source: 'SOURCE',
      web_scraper: 'WEB SCRAPER',
      local_fallback: 'LOCAL SCRAPER (FALLBACK)',
      brand_tag: 'BY POCAPAY GO // FREE K-POP TOOLS',
      brought_by: 'BROUGHT TO YOU BY',
      follow_us: 'FOLLOW US',
      footer_tagline: 'FREE TOOLS FOR THE K-POP COMMUNITY 💜',
      view_on_weverse: 'VIEW ON WEVERSE SHOP',
      clipboard_copied: 'COPIED TO CLIPBOARD!',
      clipboard_ready: 'QUERY READY TO COPY!',
      image_alt: 'Product image'
    },
    es: {
      title: 'Weverse Shop<br>Extractor',
      subtitle: 'Herramienta de Extracción',
      input_placeholder: 'BUSCAR PRODUCTO (EJ: BLACKPINK LIGHTSTICK) O URL DEL PRODUCTO...',
      extract_btn: 'EXTRAER IMAGEN',
      instructions_title: '// INSTRUCCIONES',
      instr_1: 'ESCRIBE EL NOMBRE DEL PRODUCTO QUE BUSCAS...',
      instr_2: 'EJEMPLO: "BLACKPINK LIGHTSTICK" O URL DEL PRODUCTO',
      instr_3: 'EJECUTAR EXTRACCIÓN',
      note_label: 'NOTA:',
      note_text: 'LA EXTRACCIÓN USA NAVEGADOR HEADLESS. PUEDE SER MÁS LENTO.',
      example_label: 'EJEMPLO:',
      loading: '// PROCESANDO PETICIÓN...',
      loading_search: '// BUSCANDO PRODUCTO...',
      loading_extract: '// EXTRAYENDO IMAGEN (PUEDE TARDAR)...',
      error_query: 'Por favor ingresa un término de búsqueda de producto',
      extracting: 'EXTRAYENDO...',
      download_asset: 'DESCARGAR IMAGEN',
      product_image: 'IMAGEN_PRODUCTO',
      unknown_size: 'TAMAÑO DESCONOCIDO',
      source: 'FUENTE',
      web_scraper: 'WEB SCRAPER',
      local_fallback: 'SCRAPER LOCAL (FALLBACK)',
      brand_tag: 'POR POCAPAY GO // HERRAMIENTAS K-POP GRATIS',
      brought_by: 'TRAÍDO POR',
      follow_us: 'SÍGUENOS',
      footer_tagline: 'HERRAMIENTAS GRATIS PARA LA COMUNIDAD K-POP 💜',
      view_on_weverse: 'VER EN WEVERSE SHOP',
      clipboard_copied: '¡COPIADO AL PORTAPAPELES!',
      clipboard_ready: '¡BÚSQUEDA LISTA PARA COPIAR!',
      image_alt: 'Imagen del producto'
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

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
  }

  // Example query click to copy
  exampleQuery.addEventListener('click', () => {
    const query = exampleQuery.textContent;
    navigator.clipboard.writeText(query)
      .then(() => {
        const originalText = exampleQuery.textContent;
        exampleQuery.textContent = translations[currentLang].clipboard_copied;
        setTimeout(() => {
          exampleQuery.textContent = originalText;
        }, 1500);
      })
      .catch(err => {
        console.warn('Clipboard API failed:', err);
        const originalText = exampleQuery.textContent;
        exampleQuery.textContent = translations[currentLang].clipboard_ready;
        setTimeout(() => {
          exampleQuery.textContent = originalText;
        }, 1500);
      });

    // Also fill input
    searchQueryInput.value = query;
  });

  // Initialize language on page load
  updateLanguage();

  extractBtn.addEventListener('click', extractProductImage);
  searchQueryInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      extractProductImage();
    }
  });

  async function extractProductImage() {
    const searchQuery = searchQueryInput.value.trim();

    if (!searchQuery) {
      showError(translations[currentLang].error_query);
      return;
    }

    // Show loading
    loadingElement.textContent = translations[currentLang].loading_search;
    loadingElement.style.display = 'block';
    resultSection.style.display = 'none';
    errorElement.style.display = 'none';
    extractBtn.disabled = true;
    extractBtn.textContent = translations[currentLang].extracting;

    try {
      const response = await fetch('/api/extract-product-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          searchQuery: searchQuery
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract product image');
      }

      // Handle multiple results
      if (data.multipleResults) {
         loadingElement.style.display = 'none';
         displayMultipleResults(data.results);
         return;
      }

      // Update loading message
      loadingElement.textContent = translations[currentLang].loading_extract;

      displayResults(data);
    } catch (error) {
      console.error('Error:', error);
      showError(error.message || 'An error occurred while extracting product image');
    } finally {
      loadingElement.style.display = 'none';
      extractBtn.disabled = false;
      extractBtn.textContent = translations[currentLang].extract_btn;
    }
  }

  function displayMultipleResults(results) {
    const t = translations[currentLang];
    
    // Hide single product info header
    document.querySelector('.product-info').style.display = 'none';
    
    // Clear previous images
    imageContainer.innerHTML = '';
    
    // Create grid container style if not exists
    imageContainer.style.display = 'grid';
    imageContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(280px, 1fr))';
    imageContainer.style.gap = '20px';

    results.forEach(item => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        
        // Title
        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = item.name;
        title.style.margin = '0 0 10px 0';
        title.style.fontSize = '1rem';
        title.style.minHeight = '3em'; // Align heights
        
        // Image
        const imgDiv = document.createElement('div');
        imgDiv.style.height = '250px';
        imgDiv.style.display = 'flex';
        imgDiv.style.alignItems = 'center';
        imgDiv.style.justifyContent = 'center';
        imgDiv.style.background = '#f0f0f0';
        imgDiv.style.marginBottom = '15px';
        imgDiv.style.overflow = 'hidden';
        imgDiv.style.border = '2px solid #000';

        const img = document.createElement('img');
        if (item.imageUrl) {
            img.src = item.imageUrl;
            img.alt = item.name;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
        } else {
            imgDiv.textContent = 'NO PREVIEW';
            imgDiv.style.color = '#999';
            imgDiv.style.fontWeight = 'bold';
        }
        
        if (item.imageUrl) imgDiv.appendChild(img);

        // Download button
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = t.download_asset;
        downloadBtn.onclick = () => {
            if (!item.imageUrl) {
                showError('No image available to download');
                return;
            }
            const link = document.createElement('a');
            link.href = item.imageUrl;
            const cleanProductName = item.name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').substring(0, 50);
            link.download = `${cleanProductName}_product_image.jpg`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        // View Link
        const viewLink = document.createElement('a');
        viewLink.href = item.url;
        viewLink.target = '_blank';
        viewLink.textContent = t.view_on_weverse;
        viewLink.style.display = 'block';
        viewLink.style.textAlign = 'center';
        viewLink.style.marginTop = '10px';
        viewLink.style.fontSize = '0.8rem';
        viewLink.style.color = '#666';
        viewLink.style.textDecoration = 'underline';

        imageCard.appendChild(title);
        imageCard.appendChild(imgDiv);
        imageCard.appendChild(downloadBtn);
        imageCard.appendChild(viewLink);

        imageContainer.appendChild(imageCard);
    });

    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
    
    extractBtn.disabled = false;
    extractBtn.textContent = translations[currentLang].extract_btn;
  }

  function displayResults(productData) {
    const t = translations[currentLang];
    
    // Show single product info header
    document.querySelector('.product-info').style.display = 'block';
    imageContainer.style.display = 'block'; // Reset grid
    
    // Update product info
    const productName = productData.productName || 'Producto';
    productNameElement.textContent = productName;

    productDetailsElement.textContent = (productData.note || t.product_image).toUpperCase();

    // Show product link if available
    if (productData.productUrl) {
      productLinkElement.href = productData.productUrl;
      productLinkElement.textContent = t.view_on_weverse;
      productLinkElement.style.display = 'block';
    } else {
      productLinkElement.style.display = 'none';
    }

    // Clear previous images
    imageContainer.innerHTML = '';

    // Show the selected image
    const imageCard = document.createElement('div');
    imageCard.className = 'image-card';

    const selectedImage = productData.selectedImage;

    const img = document.createElement('img');
    img.src = selectedImage.url;
    img.alt = `${productName} - ${t.image_alt}`;

    // Meta info
    const metaDiv = document.createElement('div');
    metaDiv.className = 'image-meta';

    let sizeInfo = t.unknown_size;
    if (selectedImage.width && selectedImage.height) {
      sizeInfo = `${selectedImage.width}x${selectedImage.height}PX`;
    }

    metaDiv.innerHTML = `
      <span>${t.product_image}</span>
      <span>${sizeInfo}</span>
    `;

    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'download-btn';
    downloadBtn.textContent = t.download_asset;
    downloadBtn.onclick = () => {
      const link = document.createElement('a');
      link.href = selectedImage.url;

      const cleanProductName = productName.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '').substring(0, 50);
      const dimensions = selectedImage.width && selectedImage.height ?
        `_${selectedImage.width}x${selectedImage.height}` : '';

      link.download = `${cleanProductName}${dimensions}_product_image.jpg`;
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
    let methodClass = 'puppeteer';
    let methodText = t.web_scraper;

    if (productData.usedLocalFallback) {
      methodClass = 'fallback';
      methodText = t.local_fallback;
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

  // Add styles for product-link
  const style = document.createElement('style');
  style.textContent = `
    .product-link {
      display: inline-block;
      margin-top: 10px;
      padding: 10px 20px;
      background: var(--accent-tertiary);
      color: #000;
      text-decoration: none;
      border: 3px solid #000;
      font-weight: bold;
      text-transform: uppercase;
      transition: all 0.2s;
      box-shadow: 4px 4px 0px #000;
      font-family: 'Space Mono', monospace;
    }
    .product-link:hover {
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px #000;
      background: #fff;
    }
    
    .selection-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
    }
    .selection-item {
        background: var(--bg-secondary);
        border: 2px solid #000;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 4px 4px 0px #000;
        display: flex;
        flex-direction: column;
    }
    .selection-item:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0px #000;
        background: #fff;
    }
    .selection-image {
        height: 200px;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-bottom: 2px solid #000;
    }
    .selection-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .selection-image.placeholder {
        color: #999;
        font-size: 0.8rem;
        font-weight: bold;
    }
    .selection-info {
        padding: 15px;
    }
    .selection-title {
        font-weight: bold;
        margin-bottom: 5px;
        font-size: 0.9rem;
        line-height: 1.3;
    }
    .selection-url {
        font-size: 0.7em;
        color: #666;
        word-break: break-all;
        margin-top: 5px;
    }
  `;
  document.head.appendChild(style);
});

