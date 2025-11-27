const puppeteerCore = require('puppeteer-core');
const { addExtra } = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Crear instancia de puppeteer con capacidades stealth usando puppeteer-core
const puppeteer = addExtra(puppeteerCore);
const stealthPlugin = StealthPlugin();
puppeteer.use(stealthPlugin);

console.log('✅ Stealth Plugin activado para evitar detección de bots');

/**
 * Helper para extraer la imagen principal de una página
 */
async function getImageFromPage(page) {
    return await page.evaluate(() => {
        let productImage = null;
        const debugInfo = [];

        // 1. Buscar por selectores de imagen específicos de Weverse
        const imageSelectors = [
            'img[src*="cdn-contents.weverseshop.io"]',
            'img[src*="weverseshop"]',
            'img[src*="cloudfront"]',
            'img[src*="https://"]', // Cualquier imagen con https
            '.product-image img',
            '[class*="product"] img',
            '[class*="Product"] img',
            '[class*="image"] img',
            '[class*="Image"] img',
            'div[class*="sc-"] img', // Clases generadas de styled-components
            'picture img',
            'img' // Fallback: todas las imágenes
        ];
        
        for (const selector of imageSelectors) {
            const images = Array.from(document.querySelectorAll(selector));
            debugInfo.push(`Selector "${selector}": ${images.length} imágenes encontradas`);
            
            for (const img of images) {
                const src = img.src || img.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
                const rect = img.getBoundingClientRect();
                
                if (src && src.startsWith('http')) {
                    debugInfo.push(`  - src: ${src.substring(0, 80)}... | tamaño: ${rect.width}x${rect.height}`);
                    
                    // Verificar tamaño para evitar iconos
                    if (rect.width > 150 || rect.height > 150) {
                        productImage = src;
                        debugInfo.push(`  ✅ IMAGEN SELECCIONADA!`);
                        break;
                    }
                }
            }
            if (productImage) break;
        }

        // 2. Buscar en background-image si no se encontró img
        if (!productImage) {
            const divs = Array.from(document.querySelectorAll('div'));
            debugInfo.push(`Buscando en background-image: ${divs.length} divs`);
            
            for (const div of divs) {
                const style = window.getComputedStyle(div);
                const bgImage = style.backgroundImage;
                if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
                    const match = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                    if (match && match[1]) {
                        const url = match[1];
                        const rect = div.getBoundingClientRect();
                        
                        if (url.startsWith('http') && rect.width > 150 && rect.height > 150) {
                            debugInfo.push(`  - background: ${url.substring(0, 80)}... | tamaño: ${rect.width}x${rect.height}`);
                            productImage = url;
                            debugInfo.push(`  ✅ BACKGROUND IMAGE SELECCIONADA!`);
                            break;
                        }
                    }
                }
            }
        }

        // 3. Fallback: Buscar la imagen más grande de la página
        if (!productImage) {
            debugInfo.push('Fallback: Buscando la imagen más grande');
            const allImages = Array.from(document.querySelectorAll('img'));
            let largestImage = null;
            let largestSize = 0;
            
            for (const img of allImages) {
                const rect = img.getBoundingClientRect();
                const size = rect.width * rect.height;
                
                if (img.src && img.src.startsWith('http') && size > largestSize && rect.width > 100 && rect.height > 100) {
                    largestImage = img.src;
                    largestSize = size;
                    debugInfo.push(`  - Candidata: ${img.src.substring(0, 60)}... | ${rect.width}x${rect.height} (${size} px²)`);
                }
            }
            
            if (largestImage) {
                productImage = largestImage;
                debugInfo.push(`  ✅ IMAGEN MÁS GRANDE SELECCIONADA (${largestSize} px²)`);
            }
        }

        // Log de debug
        if (!productImage) {
            console.log('DEBUG - No se encontró imagen. Info:', debugInfo.join('\n'));
        }

        return {
            imageUrl: productImage,
            productName: document.title, // Fallback name
            debugInfo: debugInfo.join('\n')
        };
    });
}

/**
 * Detecta si la query es una URL directa de producto
 */
function isProductUrl(query) {
  // Lista de dominios de tiendas conocidas
  const shopDomains = [
    'shop.weverse.io',
    'kyobobook.co.kr',
    'ktown4u.com',
    'choicemusicla.com',
    'music-plaza.com',
    'kpoptown.com',
    'kpopmart.com',
    'amazon.com',
    'target.com',
    'cdjapan.co.jp'
  ];
  
  return shopDomains.some(domain => query.includes(domain)) && query.startsWith('http');
}

/**
 * Busca un producto en Weverse Shop usando Google Search para evitar la navegación compleja
 * @param {string} searchQuery - Término de búsqueda (ej: "black pink lightstick") o URL directa
 * @returns {Promise<{url: string, name: string}|null>} - URL y nombre del producto encontrado
 */
async function searchProductOnWeverse(searchQuery) {
  let browser;

  try {
    console.log(`Buscando producto en Weverse Shop: "${searchQuery}"`);

    // Si es una URL directa, retornarla directamente
    if (isProductUrl(searchQuery)) {
      console.log('URL directa de producto detectada');
      return {
        url: searchQuery,
        name: 'Producto'
      };
    }

    const browserlessToken = process.env.BROWSERLESS_TOKEN;
    const isValidToken = browserlessToken && 
                         browserlessToken !== 'your_browserless_token_here' && 
                         browserlessToken.trim() !== '' &&
                         browserlessToken !== 'undefined';

    // Launch browser (Browserless.io si hay token válido, local si no)
    if (isValidToken) {
      console.log('searchProductOnWeverse: Usando Browserless.io para búsqueda (con Stealth Plugin)');
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://production-sfo.browserless.io?token=${browserlessToken}`
      });
    } else {
      console.log('searchProductOnWeverse: Token no válido, usando Puppeteer local con @sparticuz/chromium (con Stealth Plugin)');

      let chromium;
      try {
        chromium = require('@sparticuz/chromium');
      } catch (e) {
        console.error('Error al cargar @sparticuz/chromium. Asegúrate de que esté instalado.');
        throw e;
      }

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    // User-Agent actualizado a Chrome 131 (Nov 2024)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

    // ESTRATEGIA PRINCIPAL: Búsqueda amplia en tiendas K-pop
    const ddgSiteQuery = `${searchQuery} kpop album`;
    
    console.log(`Intentando búsqueda DuckDuckGo: ${ddgSiteQuery}`);

    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(ddgSiteQuery)}`, {
            waitUntil: 'domcontentloaded',
            timeout: 45000
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (navError) {
        console.error('Error en navegación inicial a DuckDuckGo:', navError.message);
        // Si falla la navegación, cerrar browser y lanzar error para activar fallback
        await browser.close();
        throw new Error('DuckDuckGo navigation failed: ' + navError.message);
    }

    // Helper para manejar consentimiento (útil para Google si llegamos ahí)
    const handleConsent = async () => {
        try {
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button, div[role="button"]'));
                const consentBtn = buttons.find(b => 
                b.textContent.toLowerCase().includes('reject all') || 
                b.textContent.toLowerCase().includes('accept all') ||
                b.textContent.toLowerCase().includes('i agree')
                );
                if (consentBtn) consentBtn.click();
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            // Silently ignore consent popup errors (not critical)
        }
    };

    // Helper function for evaluating DuckDuckGo results
    const evaluateDuckDuckGoResults = async (query) => {
        return await page.evaluate((searchQuery) => {
            const results = [];
            const links = Array.from(document.querySelectorAll('article h2 a, .result__title a, [data-testid="result-title-a"]'));
            
            for (const link of links) {
                if (link.href && link.textContent) {
                    results.push({ title: link.textContent.trim(), url: link.href });
                }
            }
            
            // Filtrar resultados de tiendas K-pop conocidas
            const shopDomains = [
                'shop.weverse.io',
                'global.kyobobook.co.kr',
                'ktown4u.com',
                'choicemusicla.com',
                'music-plaza.com',
                'kpoptown.com',
                'kpopmart.com',
                'amazon.com',
                'target.com',
                'cdjapan.co.jp'
            ];
            
            const shopResults = results.filter(r => 
                shopDomains.some(domain => r.url.includes(domain))
            );
            
            if (shopResults.length === 0) return null;

            // Algoritmo Levenshtein standard (strict equality)
            function levenshtein(a, b) {
                const matrix = [];
                for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
                for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
                for (let i = 1; i <= b.length; i++) {
                    for (let j = 1; j <= a.length; j++) {
                        if (b.charAt(i - 1) === a.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                        }
                    }
                }
                return matrix[b.length][a.length];
            }

            function similarity(s1, s2) {
                s1 = s1.toLowerCase();
                s2 = s2.toLowerCase();
                const longerLength = Math.max(s1.length, s2.length);
                if (longerLength === 0) return 1.0;
                return (longerLength - levenshtein(s1, s2)) / longerLength;
            }

            // Calcular similitud
            const resultsWithSimilarity = shopResults.map(res => {
                const sim = similarity(res.title, searchQuery);
                return { ...res, similarity: sim };
            });
            
            // Buscar el mejor match
            // NOTA: Ya no retornamos un solo resultado aquí, siempre devolvemos array
            // para que se extraigan las imágenes de todos los resultados

            // Fallback scoring mejorado
            function getScore(title, query) {
                const lowerTitle = title.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 1);
                let score = 0;
                let foundWords = 0;
                for (const word of queryWords) {
                    if (lowerTitle.includes(word)) { score += 10; foundWords++; }
                }
                if (lowerTitle.includes(lowerQuery)) score += 20;
                if (foundWords === 0) return -1;
                return score;
            }

            const scoredResults = shopResults.map(res => {
                 const score = getScore(res.title, searchQuery);
                 
                 // BONUS para Weverse (prioridad)
                 const isWeverse = res.url.includes('shop.weverse.io');
                 // BONUS para páginas de productos de Weverse
                 const isWeverseProduct = res.url.includes('/sales/') || /\/artists\/\d+\/sales\/\d+/.test(res.url);
                 // PENALIZACIÓN para notificaciones y noticias
                 const isNotice = res.url.includes('/notices/');
                 const isNews = res.url.includes('/news/');
                 // BONUS para otras tiendas confiables
                 const isKtown4u = res.url.includes('ktown4u.com');
                 const isKyobo = res.url.includes('kyobobook.co.kr');
                 
                 let finalScore = score;
                 if (isWeverse) finalScore += 20; // Bonus moderado para Weverse
                 if (isWeverseProduct) finalScore += 50; // BONUS para productos de Weverse
                 if (isKtown4u || isKyobo) finalScore += 30; // Bonus para tiendas coreanas
                 if (isNotice) finalScore -= 50; // Penalizar notificaciones
                 if (isNews) finalScore -= 50; // Penalizar noticias
                 
                 return { ...res, score: finalScore };
            }).filter(r => r.score > 0);

            scoredResults.sort((a, b) => b.score - a.score);
            return scoredResults.slice(0, 5).map(r => ({ url: r.url, name: r.title }));
        }, query);
    };

    // Helper function for evaluating Google results
    const evaluateGoogleResults = async (query) => {
        return await page.evaluate((searchQuery) => {
            const results = [];
            
            // Estrategia 1: Buscar títulos H3 dentro de enlaces
            const titleElements = Array.from(document.querySelectorAll('h3'));
            for (const h3 of titleElements) {
                const link = h3.closest('a');
                if (link && link.href) {
                    results.push({ title: h3.textContent, url: link.href });
                }
            }

            // Estrategia 2: Fallback a div.g a
            if (results.length === 0) {
                const linkElements = Array.from(document.querySelectorAll('div.g a'));
                for (const link of linkElements) {
                    const title = link.querySelector('h3')?.textContent || link.textContent;
                    if (link.href && title) {
                        results.push({ title: title, url: link.href });
                    }
                }
            }

            // Filtrar resultados de tiendas K-pop conocidas
            const shopDomains = [
                'shop.weverse.io',
                'global.kyobobook.co.kr',
                'ktown4u.com',
                'choicemusicla.com',
                'music-plaza.com',
                'kpoptown.com',
                'kpopmart.com',
                'amazon.com',
                'target.com',
                'cdjapan.co.jp'
            ];
            
            const shopResults = results.filter(r => 
                shopDomains.some(domain => r.url.includes(domain))
            );
            
            if (shopResults.length === 0) return null;

            // Algoritmo Levenshtein standard (strict equality)
            function levenshtein(a, b) {
                const matrix = [];
                for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
                for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
                for (let i = 1; i <= b.length; i++) {
                    for (let j = 1; j <= a.length; j++) {
                        if (b.charAt(i - 1) === a.charAt(j - 1)) {
                            matrix[i][j] = matrix[i - 1][j - 1];
                        } else {
                            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                        }
                    }
                }
                return matrix[b.length][a.length];
            }

            function similarity(s1, s2) {
                s1 = s1.toLowerCase();
                s2 = s2.toLowerCase();
                const longerLength = Math.max(s1.length, s2.length);
                if (longerLength === 0) return 1.0;
                return (longerLength - levenshtein(s1, s2)) / longerLength;
            }

            // Fallback scoring mejorado
            function getScore(title, query) {
                const lowerTitle = title.toLowerCase();
                const lowerQuery = query.toLowerCase();
                const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 1);
                let score = 0;
                let foundWords = 0;
                for (const word of queryWords) {
                    if (lowerTitle.includes(word)) { score += 10; foundWords++; }
                }
                if (lowerTitle.includes(lowerQuery)) score += 20;
                if (foundWords === 0) return -1;
                return score;
            }

            const scoredResults = shopResults.map(res => {
                 const score = getScore(res.title, searchQuery);
                 
                 // BONUS para Weverse (prioridad)
                 const isWeverse = res.url.includes('shop.weverse.io');
                 // BONUS para páginas de productos de Weverse
                 const isWeverseProduct = res.url.includes('/sales/') || /\/artists\/\d+\/sales\/\d+/.test(res.url);
                 // PENALIZACIÓN para notificaciones y noticias
                 const isNotice = res.url.includes('/notices/');
                 const isNews = res.url.includes('/news/');
                 // BONUS para otras tiendas confiables
                 const isKtown4u = res.url.includes('ktown4u.com');
                 const isKyobo = res.url.includes('kyobobook.co.kr');
                 
                 let finalScore = score;
                 if (isWeverse) finalScore += 20; // Bonus moderado para Weverse
                 if (isWeverseProduct) finalScore += 50; // BONUS para productos de Weverse
                 if (isKtown4u || isKyobo) finalScore += 30; // Bonus para tiendas coreanas
                 if (isNotice) finalScore -= 50; // Penalizar notificaciones
                 if (isNews) finalScore -= 50; // Penalizar noticias
                 
                 return { ...res, score: finalScore };
            }).filter(r => r.score > 0);

            scoredResults.sort((a, b) => b.score - a.score);
            return scoredResults.slice(0, 5).map(r => ({ url: r.url, name: r.title }));
        }, query);
    };

    // Ejecutar evaluación con DuckDuckGo (principal)
    let productResults = await evaluateDuckDuckGoResults(searchQuery);

    // ESTRATEGIA FALLBACK 1: DuckDuckGo búsqueda amplia
    if (!productResults || productResults.length === 0) {
        console.log('DuckDuckGo site: falló, intentando DuckDuckGo búsqueda amplia...');
        const ddgQuery = `Weverse Shop ${searchQuery}`;
        
        try {
            await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(ddgQuery)}`, {
                waitUntil: 'domcontentloaded',
                timeout: 45000
            });
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            productResults = await evaluateDuckDuckGoResults(searchQuery);
        } catch (e) {
            console.error('Error en DuckDuckGo búsqueda amplia:', e.message);
            // Continuar a Google
        }
    }

    // ESTRATEGIA FALLBACK 2: Google con site:
    if (!productResults || productResults.length === 0) {
        console.log('DuckDuckGo falló, intentando Google con site:...');
        const googleQuery = `site:shop.weverse.io ${searchQuery}`;
        
        try {
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}&hl=en`, {
                waitUntil: 'domcontentloaded',
                timeout: 45000
            });
            
            await handleConsent();
            try { 
                await page.waitForSelector('h3', { timeout: 5000 }); 
            } catch (e) {
                // Timeout esperado si no hay resultados
            }
            
            productResults = await evaluateGoogleResults(searchQuery);
        } catch (navError) {
            console.error('Error en Google con site:', navError.message);
            // Continuar a Google amplio
        }
    }

    // ESTRATEGIA FALLBACK 3: Google búsqueda amplia
    if (!productResults || productResults.length === 0) {
        console.log('Google site: falló, intentando Google búsqueda amplia...');
        const broadQuery = `Weverse Shop ${searchQuery}`;
        
        try {
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(broadQuery)}&hl=en`, {
                waitUntil: 'domcontentloaded',
                timeout: 45000
            });
            
            await handleConsent();
            try { 
                await page.waitForSelector('h3', { timeout: 5000 }); 
            } catch (e) {
                // Timeout esperado si no hay resultados
            }
            
            productResults = await evaluateGoogleResults(searchQuery);
        } catch (navError) {
            console.error('Error en Google búsqueda amplia:', navError.message);
            // Continuar a Bing
        }
    }

    // ESTRATEGIA FALLBACK 4: Bing (Búsqueda amplia)
    if (!productResults || productResults.length === 0) {
        console.log('Falló DuckDuckGo, intentando Bing...');
        const bingQuery = `Weverse Shop ${searchQuery}`;
        try {
            await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(bingQuery)}`, {
                waitUntil: 'domcontentloaded',
                timeout: 45000
            });
            
            await new Promise(resolve => setTimeout(resolve, 2000));

            productResults = await page.evaluate((searchQuery) => {
                 const results = [];
                 const links = Array.from(document.querySelectorAll('li.b_algo h2 a, .b_title a'));
                 for (const link of links) results.push({ title: link.textContent, url: link.href });
                 
                 // Filtrar resultados de tiendas K-pop conocidas
                 const shopDomains = [
                    'shop.weverse.io',
                    'global.kyobobook.co.kr',
                    'ktown4u.com',
                    'choicemusicla.com',
                    'music-plaza.com',
                    'kpoptown.com',
                    'kpopmart.com',
                    'amazon.com',
                    'target.com',
                    'cdjapan.co.jp'
                 ];
                 
                 const shopResults = results.filter(r => 
                    shopDomains.some(domain => r.url.includes(domain))
                 );
                 
                 if (shopResults.length === 0) return null;

                 // Levenshtein (copiado para contexto evaluate, strict equality)
                 function levenshtein(a, b) {
                    const matrix = [];
                    for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
                    for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
                    for (let i = 1; i <= b.length; i++) {
                        for (let j = 1; j <= a.length; j++) {
                            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                                matrix[i][j] = matrix[i - 1][j - 1];
                            } else {
                                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                            }
                        }
                    }
                    return matrix[b.length][a.length];
                }
                function similarity(s1, s2) {
                    s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
                    const longer = Math.max(s1.length, s2.length);
                    return longer === 0 ? 1.0 : (longer - levenshtein(s1, s2)) / longer;
                }

                // NOTA: Ya no retornamos un solo resultado, siempre devolvemos array
                // para que se extraigan las imágenes de todos los resultados

                const scoredResults = shopResults.map(res => {
                     let score = 0;
                     const lowerTitle = res.title.toLowerCase();
                     const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(w => w.length > 1);
                     for (const word of queryWords) if (lowerTitle.includes(word)) score += 10;
                     
                     // BONUS para Weverse (prioridad)
                     const isWeverse = res.url.includes('shop.weverse.io');
                     const isWeverseProduct = res.url.includes('/sales/') || /\/artists\/\d+\/sales\/\d+/.test(res.url);
                     const isNotice = res.url.includes('/notices/');
                     const isNews = res.url.includes('/news/');
                     const isKtown4u = res.url.includes('ktown4u.com');
                     const isKyobo = res.url.includes('kyobobook.co.kr');
                     
                     if (isWeverse) score += 20;
                     if (isWeverseProduct) score += 50;
                     if (isKtown4u || isKyobo) score += 30;
                     if (isNotice) score -= 50;
                     if (isNews) score -= 50;
                     
                     return { ...res, score: score };
                }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

                return scoredResults.slice(0, 5).map(r => ({ url: r.url, name: r.title }));
            }, searchQuery);
        } catch (e) {
            console.error('Error en Bing:', e.message);
        }
    }

    await browser.close();

    if (productResults && productResults.length > 0) {
        return productResults; // Retorna array
    } else {
        throw new Error(`No se encontraron resultados en Weverse Shop para "${searchQuery}". Intenta con la URL directa.`);
    }

  } catch (error) {
    console.error('Error buscando producto con Puppeteer:', error);
    if (browser) await browser.close().catch(() => {});
    throw error;
  }
}

/**
 * Extrae imágenes para una lista de productos (para mostrar opciones)
 * @param {Array} productList - Lista de productos con url y name
 * @param {string} searchQuery - Query original del usuario para calcular similitud
 * @returns {Promise<Array>} - Lista con imágenes y títulos reales extraídos
 */
async function extractImagesFromList(productList, searchQuery = null) {
  let browser;
  try {
    
    // Configuración del navegador con validación de token
    const browserlessToken = process.env.BROWSERLESS_TOKEN;
    const isValidToken = browserlessToken && 
                         browserlessToken !== 'your_browserless_token_here' && 
                         browserlessToken.trim() !== '' &&
                         browserlessToken !== 'undefined';
    
    if (isValidToken) {
       console.log('extractImagesFromList: Usando Browserless.io (con Stealth Plugin)');
       browser = await puppeteer.connect({ browserWSEndpoint: `wss://production-sfo.browserless.io?token=${browserlessToken}` });
    } else {
       console.log('extractImagesFromList: Usando Chrome local (con Stealth Plugin)');
       const chromium = require('@sparticuz/chromium');
       browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
       });
    }

    // Procesar en paralelo (limitado a 3 tabs)
    // Usar Promise.allSettled para que continúe aunque algunos fallen
    const results = await Promise.allSettled(productList.map(async (item) => {
        let page;
        try {
            console.log(`Extrayendo imagen de: ${item.url}`);
            page = await browser.newPage();
            // Set viewport to ensure images load
            await page.setViewport({ width: 1920, height: 1080 });
            
            // User-Agent para evitar detección
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');

            // Bloquear recursos innecesarios para acelerar, pero permitir scripts e imágenes
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                const resourceType = req.resourceType();
                if (['font', 'media'].includes(resourceType)) req.abort();
                else req.continue();
            });

            // Usar networkidle2 para asegurar que la SPA cargó
            await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 45000 });
            
            // Espera adicional para renderizado JS y carga de imágenes
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Extraer imagen Y título real del producto desde Weverse
            const result = await getImageFromPage(page);
            
            if (!result || !result.imageUrl) {
                console.warn(`No se encontró imagen en ${item.url}, intentando esperar más...`);
                if (result && result.debugInfo) {
                    console.log('Debug info:', result.debugInfo);
                }
                // Esperar un poco más y volver a intentar
                await new Promise(resolve => setTimeout(resolve, 3000));
                const retryResult = await getImageFromPage(page);
                if (retryResult && retryResult.imageUrl) {
                    console.log(`✅ Imagen encontrada en segundo intento para ${item.url}`);
                    result.imageUrl = retryResult.imageUrl;
                } else if (retryResult && retryResult.debugInfo) {
                    console.log('Debug info (retry):', retryResult.debugInfo);
                }
            }
            
            // Extraer título real del producto
            const realProductName = await page.evaluate(() => {
               const nameSelectors = [
                'h1',
                '[class*="product-name"]',
                '[class*="title"]',
                '[data-testid*="product"]'
              ];

              for (const selector of nameSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent?.trim()) {
                  return element.textContent.trim();
                }
              }
              return null;
            });

            await page.close();
            
            if (!result || !result.imageUrl) {
                console.error(`❌ No se pudo extraer imagen de ${item.url}`);
                throw new Error(`No se pudo extraer imagen de ${item.url}`);
            }
            
            console.log(`✅ Imagen extraída exitosamente de ${item.url}`);
            
            // Usar el título real de Weverse, no el de la búsqueda
            return { 
                ...item, 
                name: realProductName || item.name, // Priorizar título real
                googleTitle: item.name, // Guardar título de búsqueda para referencia
                imageUrl: result.imageUrl 
            };
        } catch (e) {
            console.error(`❌ Error extrayendo imagen para ${item.name} (${item.url}): ${e.message}`);
            if (page) await page.close().catch(() => {});
            // Lanzar error para que Promise.allSettled lo capture
            throw new Error(`Error extrayendo imagen de ${item.url}: ${e.message}`);
        }
    }));

    await browser.close();
    
    // Procesar resultados de Promise.allSettled
    // Filtrar solo los que tuvieron éxito y tienen imagen
    const successfulResults = results
        .filter(r => r.status === 'fulfilled' && r.value && r.value.imageUrl)
        .map(r => r.value);
    
    // Log de errores para debugging
    const failedResults = results.filter(r => r.status === 'rejected');
    if (failedResults.length > 0) {
        console.warn(`⚠️ ${failedResults.length} productos fallaron al extraer imágenes:`);
        failedResults.forEach(r => console.warn(`  - ${r.reason?.message || r.reason}`));
    }
    
    if (successfulResults.length === 0) {
        console.error('❌ No se pudo extraer ninguna imagen de los productos encontrados');
        throw new Error('No se pudieron extraer imágenes de ningún producto. Intenta con una búsqueda diferente o URL directa.');
    }
    
    console.log(`✅ Se extrajeron ${successfulResults.length} imágenes exitosamente de ${productList.length} productos`);
    
    // Usar solo los resultados exitosos
    const finalResults = successfulResults;
    
    // Si se proporcionó searchQuery, calcular similitud con títulos REALES
    if (searchQuery) {
        // Algoritmo Levenshtein
        function levenshtein(a, b) {
            const matrix = [];
            for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
            for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
            for (let i = 1; i <= b.length; i++) {
                for (let j = 1; j <= a.length; j++) {
                    if (b.charAt(i - 1) === a.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
                    }
                }
            }
            return matrix[b.length][a.length];
        }

        function similarity(s1, s2) {
            s1 = s1.toLowerCase();
            s2 = s2.toLowerCase();
            const longerLength = Math.max(s1.length, s2.length);
            if (longerLength === 0) return 1.0;
            return (longerLength - levenshtein(s1, s2)) / longerLength;
        }
        
        // Calcular similitud con títulos REALES de Weverse
        const resultsWithSimilarity = finalResults.map(res => ({
            ...res,
            similarity: similarity(res.name, searchQuery)
        }));
        
        // Si el mejor match tiene ≥85% de similitud, devolver solo ese
        const bestMatch = resultsWithSimilarity.reduce((prev, current) => 
            (prev.similarity > current.similarity) ? prev : current
        );
        
        console.log(`Mejor match: "${bestMatch.name}" con similitud ${(bestMatch.similarity * 100).toFixed(1)}%`);
        
        if (bestMatch.similarity >= 0.85) {
            console.log('Similitud ≥85%, devolviendo solo el mejor resultado');
            return [bestMatch]; // Devolver solo el mejor
        }
        
        return resultsWithSimilarity;
    }
    
    return finalResults;

  } catch (error) {
      console.error('Error en extractImagesFromList:', error);
      if (browser) await browser.close().catch(() => {});
      return productList; // Devolver lista original si falla
  }
}

/**
 * Extrae la imagen del producto desde la página de producto de Weverse Shop
 * @param {string} productUrl - URL de la página del producto
 * @returns {Promise<{url: string, productName: string}|null>} - URL de la imagen y nombre del producto
 */
async function extractProductImage(productUrl) {
  let browser;

  try {
    
    const browserlessToken = process.env.BROWSERLESS_TOKEN;
    const isValidToken = browserlessToken && 
                         browserlessToken !== 'your_browserless_token_here' && 
                         browserlessToken.trim() !== '' &&
                         browserlessToken !== 'undefined';

    // Launch browser
    if (isValidToken) {
      console.log('extractProductImage: Usando Browserless.io (con Stealth Plugin)');
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://production-sfo.browserless.io?token=${browserlessToken}`
      });
    } else {
      console.log('extractProductImage: Usando Chrome local (con Stealth Plugin)');
      let chromium;
      try {
        chromium = require('@sparticuz/chromium');
      } catch (e) {
        console.error('Error al cargar @sparticuz/chromium.');
        throw e;
      }

      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    }

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // User-Agent actualizado a Chrome 131 (Nov 2024)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    
    // Optimización: Bloquear recursos innecesarios
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['font', 'media'].includes(resourceType)) req.abort();
        else req.continue();
    });

    await page.goto(productUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    await page.waitForFunction(() => document.readyState === 'complete');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extraer imagen del producto usando el helper
    const imageData = await getImageFromPage(page);
    
    // Refinar nombre del producto si es posible
    const productName = await page.evaluate(() => {
       const nameSelectors = [
        'h1',
        '[class*="product-name"]',
        '[class*="title"]',
        '[data-testid*="product"]'
      ];

      for (const selector of nameSelectors) {
        const element = document.querySelector(selector);
        if (element && element.textContent?.trim()) {
          return element.textContent.trim();
        }
      }
      return null;
    });

    await browser.close();

    if (imageData && imageData.imageUrl) {
      return {
        url: imageData.imageUrl,
        productName: productName || imageData.productName || 'Producto',
        browserType: browserlessToken ? 'Browserless.io' : 'Local Chrome'
      };
    } else {
      return null;
    }

  } catch (error) {
    console.error('Error extrayendo imagen del producto con Puppeteer:', error);

    if (error.message && (error.message.includes('Unexpected server response: 401') || error.message.includes('Unexpected server response: 403'))) {
      console.error('❌ Error de autenticación/autorización de Browserless');
    }

    if (browser) {
      await browser.close().catch(() => { });
    }
    throw error;
  }
}

module.exports = { searchProductOnWeverse, extractProductImage, extractImagesFromList };
