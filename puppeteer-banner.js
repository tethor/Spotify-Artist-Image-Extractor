const puppeteer = require('puppeteer-core');

/**
 * Extracts the banner image URL from a Spotify artist page using Puppeteer
 * @param {string} artistUrl - The Spotify artist URL
 * @returns {Promise<string|null>} - The banner image URL or null if not found
 */
async function extractBannerWithPuppeteer(artistUrl) {
  let browser;

  try {
    console.log('Launching Puppeteer to extract banner...');

    const browserlessToken = process.env.BROWSERLESS_TOKEN;

    // Launch browser (Browserless.io si hay token, local si no)
    if (browserlessToken) {
      console.log('Using Browserless.io for banner extraction');
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://production-sfo.browserless.io?token=${browserlessToken}`
      });
    } else {
      console.log('BROWSERLESS_TOKEN not found, using local Puppeteer with @sparticuz/chromium');

      let chromium;
      try {
        chromium = require('@sparticuz/chromium');
      } catch (e) {
        console.error('Failed to load @sparticuz/chromium. Make sure it is installed.');
        throw e;
      }

      // Usar Chromium optimizado para serverless
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();

    // Set desktop viewport (para ver el banner completo en alta resolución)
    // User suggested 2660x1140px, we use slightly larger height to be safe
    await page.setViewport({ width: 2660, height: 1400 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

    console.log(`Navigating to: ${artistUrl}`);
    await page.goto(artistUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Esperar a que se cargue el contenido
    await page.waitForFunction(() => document.readyState === 'complete');

    // Esperar extra tiempo para que cargue el banner (usar setTimeout de Node.js)
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Extracting banner from DOM...');

    // Extraer banner usando lógica mejorada para encontrar la imagen más grande/ancha
    const bannerUrl = await page.evaluate(() => {
      // Helper para extraer URL de background-image
      function extractUrlFromStyle(style) {
        if (!style || !style.includes('url(')) return null;
        const match = style.match(/url\(['"]?(.*?)['"]?\)/);
        return match ? match[1] : null;
      }

      const candidates = [];

      // 1. Buscar en elementos específicos conocidos (background-image)
      const bgElements = document.querySelectorAll('div[data-testid="background-image"], div[data-testid="entity-image"], .main-view-container__scroll-node-child');
      bgElements.forEach(el => {
        const style = window.getComputedStyle(el).backgroundImage;
        if (style && style !== 'none') {
          const url = extractUrlFromStyle(style);
          if (url) {
            const rect = el.getBoundingClientRect();
            candidates.push({
              url,
              width: rect.width,
              height: rect.height,
              area: rect.width * rect.height,
              source: 'background-element'
            });
          }
        }
      });

      // 2. Buscar en todas las imágenes grandes (img tags)
      const allImages = Array.from(document.querySelectorAll('img'));
      allImages.forEach(img => {
        if (!img.src) return;
        const rect = img.getBoundingClientRect();
        // Filtrar iconos y miniaturas
        if (rect.width > 300 && rect.height > 100) {
          candidates.push({
            url: img.src,
            width: rect.width,
            height: rect.height,
            area: rect.width * rect.height,
            source: 'img-tag'
          });
        }
      });

      // 3. Buscar cualquier elemento con background-image grande
      // (Limitamos la búsqueda para no matar el rendimiento)
      const potentialDivs = document.querySelectorAll('div');
      // Solo revisamos los primeros 50 divs grandes o contenedores principales
      let checkedCount = 0;
      for (const div of potentialDivs) {
        if (checkedCount > 200) break;

        const rect = div.getBoundingClientRect();
        if (rect.width > 600 && rect.height > 200) {
          const style = window.getComputedStyle(div).backgroundImage;
          if (style && style !== 'none' && style.includes('http')) {
            const url = extractUrlFromStyle(style);
            if (url) {
              candidates.push({
                url,
                width: rect.width,
                height: rect.height,
                area: rect.width * rect.height,
                source: 'generic-background'
              });
            }
          }
          checkedCount++;
        }
      }

      console.log('Candidates found:', candidates);

      if (candidates.length === 0) return null;

      // Ordenar candidatos:
      // Prioridad 1: Área (más grande es mejor para banner)
      // Prioridad 2: Aspect Ratio (más ancho es mejor para banner)

      candidates.sort((a, b) => {
        return b.area - a.area;
      });

      // Devolver el mejor candidato
      return candidates[0].url;
    });

    await browser.close();
    console.log('Browser closed');

    if (bannerUrl) {
      console.log('Banner found:', bannerUrl);
      return {
        url: bannerUrl,
        browserType: browserlessToken ? 'Browserless.io' : 'Local Chrome'
      };
    } else {
      console.log('No banner found on this artist page');
      return null;
    }

  } catch (error) {
    console.error('Error extracting banner with Puppeteer:', error);

    // Detectar errores de autenticación/autorización de Browserless (401 y 403)
    if (error.message && (error.message.includes('Unexpected server response: 401') || error.message.includes('Unexpected server response: 403'))) {
      console.error('❌ Browserless.io authentication/authorization failed - Token invalid or unauthorized');
    }

    if (browser) {
      await browser.close().catch(() => { });
    }
    throw error;
  }
}

module.exports = { extractBannerWithPuppeteer };