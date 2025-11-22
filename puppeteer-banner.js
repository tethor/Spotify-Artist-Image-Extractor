const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

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
      
      // Usar Chromium optimizado para serverless
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }
    
    const page = await browser.newPage();
    
    // Set desktop viewport (para ver el banner completo)
    await page.setViewport({ width: 1920, height: 1080 });
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
    
    // Extraer banner usando los selectores del proyecto original
    const bannerUrl = await page.evaluate(() => {
      // Helper para extraer URL de background-image
      function extractUrlFromStyle(style) {
        if (!style || !style.includes('url(')) return null;
        const match = style.match(/url\(['"]?(.*?)['"]?\)/);
        return match ? match[1] : null;
      }
      
      // Estrategia 1: Buscar background-image
      const backgroundImage = document.querySelector('div[data-testid="background-image"]');
      if (backgroundImage) {
        const style = window.getComputedStyle(backgroundImage).backgroundImage;
        if (style && style !== 'none') {
          const url = extractUrlFromStyle(style);
          if (url) return url;
        }
      }
      
      // Estrategia 2: Buscar entity image
      const entityImage = document.querySelector('div[data-testid="entity-image"]');
      if (entityImage) {
        const img = entityImage.querySelector('img');
        if (img && img.src) {
          return img.src;
        }
        
        const style = window.getComputedStyle(entityImage).backgroundImage;
        if (style && style !== 'none') {
          const url = extractUrlFromStyle(style);
          if (url) return url;
        }
      }
      
      // Estrategia 3: Buscar patrón ab67618600000194
      const allElements = Array.from(document.querySelectorAll('*'));
      for (const el of allElements) {
        const bgStyle = window.getComputedStyle(el).backgroundImage;
        if (bgStyle && bgStyle !== 'none' && bgStyle.includes('ab67618600000194')) {
          const url = extractUrlFromStyle(bgStyle);
          if (url) return url;
        }
      }
      
      // Estrategia 4: Buscar cualquier imagen grande
      const allImages = Array.from(document.querySelectorAll('img'));
      const largeImages = allImages
        .filter(img => {
          if (!img.src) return false;
          const rect = img.getBoundingClientRect();
          return rect.width > 400 && rect.height > 200;
        })
        .sort((a, b) => {
          const rectA = a.getBoundingClientRect();
          const rectB = b.getBoundingClientRect();
          return (rectB.width * rectB.height) - (rectA.width * rectA.height);
        });
      
      if (largeImages.length > 0) {
        return largeImages[0].src;
      }
      
      return null;
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
      await browser.close().catch(() => {});
    }
    throw error;
  }
}

module.exports = { extractBannerWithPuppeteer };