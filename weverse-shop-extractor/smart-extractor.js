const axios = require('axios');
const cheerio = require('cheerio');

/**
 * ESTRATEGIA 1: Buscar directamente la imagen en Google Images
 * Esto es mucho más confiable que buscar páginas y luego extraer imágenes
 */
async function searchGoogleImages(query) {
    try {
        console.log(`🔍 Buscando imágenes en Google Images: "${query}"`);
        
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query + ' kpop album')}&tbm=isch&hl=en`;
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            timeout: 10000
        });

        // Extraer URLs de imágenes del HTML de Google Images
        const html = response.data;
        const imageUrls = [];
        
        // Google Images incrusta las URLs en formato JSON dentro del HTML
        const jsonMatches = html.match(/\["(https:\/\/[^"]+)",\d+,\d+\]/g);
        
        if (jsonMatches) {
            for (const match of jsonMatches) {
                const urlMatch = match.match(/\["(https:\/\/[^"]+)"/);
                if (urlMatch && urlMatch[1]) {
                    const url = urlMatch[1];
                    // Filtrar solo imágenes de CDNs de tiendas conocidas
                    if (url.includes('weverseshop') || 
                        url.includes('ktown4u') || 
                        url.includes('kyobobook') ||
                        url.includes('cloudfront') ||
                        url.includes('cdn')) {
                        imageUrls.push(url);
                    }
                }
            }
        }

        if (imageUrls.length > 0) {
            console.log(`✅ Google Images encontró ${imageUrls.length} imágenes`);
            return imageUrls;
        }

        console.log('⚠️ No se encontraron imágenes en Google Images');
        return null;
    } catch (error) {
        console.error('Error en búsqueda de Google Images:', error.message);
        return null;
    }
}

/**
 * ESTRATEGIA PRINCIPAL: Buscar en Google Web usando Custom Search JSON API
 * Sin filtros adicionales - búsqueda directa como Google normal
 * Requiere configurar las variables de entorno GOOGLE_API_KEY y GOOGLE_CX
 */
async function searchGoogleWeb(query) {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CX;

    if (!apiKey || !cx) {
        console.log('ℹ️ Google Custom Search no configurado (GOOGLE_API_KEY/GOOGLE_CX), usando DuckDuckGo como alternativa');
        return null;
    }

    try {
        console.log(`🌐 Buscando en Google Custom Search (sin filtros): "${query}"`);
        
        // Búsqueda directa sin añadir filtros adicionales
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=10`;
        
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; extractor/1.0)'
            },
            timeout: 10000
        });

        if (!res.data || !res.data.items) {
            console.log('⚠️ Google Custom Search no devolvió resultados');
            return null;
        }

        const items = res.data.items.map(item => ({
            url: item.link,
            title: item.title,
            snippet: item.snippet || ''
        }));

        console.log(`✅ Google Custom Search devolvió ${items.length} resultados`);
        items.forEach((item, i) => console.log(`   ${i+1}. ${item.title.substring(0, 60)}... (${item.url.substring(0, 50)}...)`));
        
        return items;
    } catch (err) {
        console.error('❌ Error en Google Custom Search:', err.response?.data?.error?.message || err.message);
        return null;
    }
}

/**
 * Algoritmo de similitud de Levenshtein para comparar textos
 */
function calculateSimilarity(str1, str2) {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();
    
    // Levenshtein distance
    function levenshtein(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }
    
    const longer = Math.max(s1.length, s2.length);
    if (longer === 0) return 1.0;
    
    return (longer - levenshtein(s1, s2)) / longer;
}

/**
 * Calcula un score de relevancia entre el título y la búsqueda
 */
function calculateRelevanceScore(title, searchQuery) {
    const lowerTitle = title.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    
    let score = 0;
    
    // 1. Similitud de Levenshtein (0-100 puntos)
    const similarity = calculateSimilarity(title, searchQuery);
    score += similarity * 100;
    
    // 2. Palabras clave en común (0-50 puntos)
    const queryWords = lowerQuery.split(/\s+/).filter(w => w.length > 2);
    let matchedWords = 0;
    for (const word of queryWords) {
        if (lowerTitle.includes(word)) {
            matchedWords++;
        }
    }
    score += (matchedWords / queryWords.length) * 50;
    
    // 3. Contiene la búsqueda completa (bonus 30 puntos)
    if (lowerTitle.includes(lowerQuery)) {
        score += 30;
    }
    
    return {
        score: Math.round(score),
        similarity: Math.round(similarity * 100),
        matchedWords: matchedWords,
        totalWords: queryWords.length
    };
}

/**
 * ESTRATEGIA 2: Extraer metadatos Open Graph de una URL
 * Los metadatos og:image son estáticos y no requieren JavaScript
 */
async function extractOpenGraphImage(url, expectedTitle = null) {
    try {
        console.log(`📄 Extrayendo metadatos Open Graph de: ${url}`);
        
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Cache-Control': 'max-age=0',
            },
            timeout: 15000,
            maxRedirects: 5,
            validateStatus: (status) => status < 500 // No lanzar error en 4xx
        });

        // Si es 403 o 401, retornar null para que se use Puppeteer
        if (response.status === 403 || response.status === 401) {
            console.log(`⚠️ Acceso bloqueado (${response.status}), se requiere Puppeteer para esta página`);
            return { requiresPuppeteer: true };
        }

        const $ = cheerio.load(response.data);
        
        // Buscar meta tags de Open Graph
        const ogImage = $('meta[property="og:image"]').attr('content') ||
                       $('meta[name="og:image"]').attr('content') ||
                       $('meta[property="twitter:image"]').attr('content') ||
                       $('meta[name="twitter:image"]').attr('content');
        
        const ogTitle = $('meta[property="og:title"]').attr('content') ||
                       $('meta[name="og:title"]').attr('content') ||
                       $('title').text();
        
        const ogDescription = $('meta[property="og:description"]').attr('content') ||
                             $('meta[name="description"]').attr('content') || '';

        // Calcular relevancia si se proporciona título esperado
        let relevance = null;
        if (expectedTitle && ogTitle) {
            relevance = calculateRelevanceScore(ogTitle, expectedTitle);
            console.log(`📊 Relevancia: ${relevance.score}% | Similitud: ${relevance.similarity}% | Palabras: ${relevance.matchedWords}/${relevance.totalWords}`);
        }

        if (ogImage) {
            console.log(`✅ Imagen Open Graph encontrada: ${ogImage.substring(0, 80)}...`);
            console.log(`📝 Título: ${ogTitle}`);
            
            return {
                imageUrl: ogImage,
                productName: ogTitle || 'Producto',
                source: 'Open Graph',
                relevance: relevance
            };
        }

        // Fallback: buscar la primera imagen grande en el HTML estático
        const images = [];
        $('img').each((i, elem) => {
            let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy-src');
            
            // Si la src es relativa, convertirla a absoluta
            if (src && !src.startsWith('http')) {
                const urlObj = new URL(url);
                if (src.startsWith('//')) {
                    src = 'https:' + src;
                } else if (src.startsWith('/')) {
                    src = urlObj.origin + src;
                } else {
                    src = urlObj.origin + '/' + src;
                }
            }
            
            if (src && src.startsWith('http')) {
                images.push(src);
            }
        });

        if (images.length > 0) {
            // Priorizar imágenes de CDN y que no sean iconos
            const goodImages = images.filter(img => 
                (img.includes('cdn') || 
                 img.includes('weverseshop') || 
                 img.includes('cloudfront') ||
                 img.includes('kpopmart') ||
                 img.includes('kpoptown')) &&
                !img.includes('logo') &&
                !img.includes('icon') &&
                !img.includes('banner')
            );
            
            const bestImage = goodImages[0] || images[0];
            
            if (bestImage) {
                console.log(`✅ Imagen encontrada en HTML: ${bestImage.substring(0, 80)}...`);
                
                // Calcular relevancia si hay título
                let relevance = null;
                if (expectedTitle && ogTitle) {
                    relevance = calculateRelevanceScore(ogTitle, expectedTitle);
                    console.log(`📊 Relevancia: ${relevance.score}% | Similitud: ${relevance.similarity}% | Palabras: ${relevance.matchedWords}/${relevance.totalWords}`);
                }
                
                return {
                    imageUrl: bestImage,
                    productName: ogTitle || 'Producto',
                    source: 'HTML Static',
                    relevance: relevance
                };
            }
        }

        console.log('⚠️ No se encontró imagen en Open Graph ni HTML, se requiere Puppeteer');
        return { requiresPuppeteer: true };
    } catch (error) {
        console.error(`Error extrayendo Open Graph de ${url}:`, error.message);
        return null;
    }
}

/**
 * ESTRATEGIA FALLBACK: Búsqueda en DuckDuckGo con scraping simple
 * Se usa solo si Google Custom Search no está configurado
 */
async function searchDuckDuckGo(query) {
    try {
        console.log(`🦆 Buscando en DuckDuckGo (fallback): "${query}"`);
        
        // Sin filtros adicionales, búsqueda directa
        const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        
        const response = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const results = [];

        $('.result__a').each((i, elem) => {
            const url = $(elem).attr('href');
            const text = $(elem).text();
            
            if (url && text) {
                // Extraer URL real (DuckDuckGo usa redirects)
                let realUrl = url;
                
                // Método 1: Buscar parámetro uddg
                const uddgMatch = url.match(/uddg=([^&]+)/);
                if (uddgMatch) {
                    realUrl = decodeURIComponent(uddgMatch[1]);
                }
                
                // Método 2: Si la URL es un redirect de DuckDuckGo, intentar extraer la URL real
                if (realUrl.includes('duckduckgo.com/y.js') || realUrl.includes('duckduckgo.com/l/')) {
                    // Buscar en el HTML del link
                    const snippet = $(elem).closest('.result').find('.result__snippet').text();
                    // Intentar extraer URL del snippet o saltar este resultado
                    console.log(`⚠️ Saltando redirect de DuckDuckGo: ${realUrl.substring(0, 80)}...`);
                    return; // skip this result
                }
                
                results.push({
                    url: realUrl,
                    title: text.trim()
                });
            }
        });

        // Filtrar solo tiendas conocidas y EXCLUIR notificaciones/noticias
        const shopDomains = [
            'shop.weverse.io',
            'ktown4u.com',
            'kyobobook.co.kr',
            'kpoptown.com',
            'kpopmart.com',
            'choicemusicla.com',
            'music-plaza.com'
        ];

        const shopResults = results.filter(r => {
            // Debe ser de una tienda conocida
            const isShop = shopDomains.some(domain => r.url.includes(domain));
            
            // NO debe ser página de notificaciones o noticias
            const isNotNotice = !r.url.includes('/notices/') && !r.url.includes('/notice/');
            const isNotNews = !r.url.includes('/news/');
            
            // Para Weverse, debe ser página de producto (/sales/)
            const isWeverseProduct = !r.url.includes('shop.weverse.io') || r.url.includes('/sales/');
            
            return isShop && isNotNotice && isNotNews && isWeverseProduct;
        });

        if (shopResults.length > 0) {
            console.log(`✅ DuckDuckGo encontró ${shopResults.length} resultados válidos de tiendas`);
            shopResults.forEach(r => console.log(`   - ${r.title} (${r.url.substring(0, 60)}...)`));
            return shopResults.slice(0, 5);
        }

        console.log('⚠️ DuckDuckGo no encontró resultados válidos de tiendas');
        return null;
    } catch (error) {
        console.error('Error en búsqueda DuckDuckGo:', error.message);
        return null;
    }
}

/**
 * ESTRATEGIA MAESTRA: Combinar todas las estrategias de forma inteligente
 */
async function smartExtractProductImage(searchQuery) {
    console.log('\n🧠 ESTRATEGIA INTELIGENTE DE EXTRACCIÓN');
    console.log('========================================\n');

    // PASO 1: Intentar Google Custom Search (web) si está configurado, sino DuckDuckGo
    let productPages = null;
    const googleResults = await searchGoogleWeb(searchQuery);
    if (googleResults && googleResults.length > 0) {
        productPages = googleResults.map(r => ({ url: r.url, title: r.title }));
    } else {
        productPages = await searchDuckDuckGo(searchQuery);
    }
    
    if (productPages && productPages.length > 0) {
        console.log(`\n📋 Analizando ${productPages.length} páginas de productos...\n`);
        
        // PASO 2: Extraer Open Graph de cada página y calcular relevancia
        const candidates = [];
        const puppeteerRequired = [];
        
        for (const page of productPages) {
            const imageData = await extractOpenGraphImage(page.url, searchQuery);
            
            if (imageData && imageData.requiresPuppeteer) {
                puppeteerRequired.push(page);
            } else if (imageData && imageData.imageUrl) {
                candidates.push({
                    ...imageData,
                    pageUrl: page.url,
                    pageTitle: page.title
                });
            }
        }
        
        // Si encontramos candidatos con Open Graph, usarlos
        if (candidates.length > 0) {
            console.log(`\n✅ Se extrajeron ${candidates.length} imágenes con Open Graph/HTML\n`);

            // Ordenar por relevancia (mayor a menor) - solo si tienen relevancia calculada
            const candidatesWithRelevance = candidates.filter(c => c.relevance);
            const candidatesWithoutRelevance = candidates.filter(c => !c.relevance);
            
            candidatesWithRelevance.sort((a, b) => b.relevance.score - a.relevance.score);
            
            // Combinar: primero los que tienen relevancia, luego los que no
            const sortedCandidates = [...candidatesWithRelevance, ...candidatesWithoutRelevance];
            
            if (sortedCandidates.length > 0) {
                const best = sortedCandidates[0];
            
                console.log(`\n🏆 MEJOR MATCH ENCONTRADO:`);
                console.log(`   📝 Título: "${best.productName}"`);
                
                if (best.relevance) {
                    console.log(`   📊 Score de Relevancia: ${best.relevance.score}%`);
                    console.log(`   🔗 Similitud de texto: ${best.relevance.similarity}%`);
                    console.log(`   ✅ Palabras coincidentes: ${best.relevance.matchedWords}/${best.relevance.totalWords}`);
                }
                
                console.log(`   🌐 URL: ${best.pageUrl.substring(0, 60)}...\n`);
                
                // Si el mejor tiene score >= 40% (o no tiene relevancia pero es la única opción), usarlo
                const shouldUse = !best.relevance || best.relevance.score >= 40;
                
                if (shouldUse) {
                    const noteText = best.relevance 
                        ? `Imagen verificada con ${best.relevance.score}% de coincidencia (${best.relevance.matchedWords}/${best.relevance.totalWords} palabras)`
                        : `Imagen extraída de ${best.source}`;
                    
                    return {
                        productName: best.productName,
                        productUrl: best.pageUrl,
                        selectedImage: { url: best.imageUrl },
                        allImages: [{ url: best.imageUrl }],
                        method: 'open_graph_smart',
                        note: noteText,
                        relevance: best.relevance,
                        alternatives: sortedCandidates.length > 1 ? sortedCandidates.slice(1, 3).map(c => ({
                            url: c.pageUrl,
                            name: c.productName,
                            relevance: c.relevance ? c.relevance.score : null
                        })) : []
                    };
                } else {
                    // Si el mejor tiene score bajo, devolver múltiples opciones
                    console.log(`⚠️ Relevancia baja (${best.relevance.score}%), mostrando múltiples opciones al usuario\n`);
                    return {
                        multipleResults: true,
                        results: sortedCandidates.map(c => ({
                            url: c.pageUrl,
                            name: c.productName,
                            imageUrl: c.imageUrl,
                            relevance: c.relevance ? c.relevance.score : null
                        }))
                    };
                }
            }
        }
        
        // Si hay páginas que requieren Puppeteer, devolver esas opciones
        if (puppeteerRequired.length > 0) {
            console.log(`⚠️ ${puppeteerRequired.length} páginas requieren Puppeteer (protección anti-bot)\n`);
            return {
                multipleResults: true,
                results: puppeteerRequired.map(p => ({
                    url: p.url,
                    name: p.title,
                    imageUrl: null,
                    requiresPuppeteer: true
                }))
            };
        }

        // Si no se pudo extraer Open Graph, devolver las opciones para que el usuario elija
        console.log(`⚠️ No se pudieron extraer metadatos Open Graph, mostrando URLs encontradas\n`);
        return {
            multipleResults: true,
            results: productPages.map(p => ({
                url: p.url,
                name: p.title,
                imageUrl: null
            }))
        };
    }

    // PASO 3: FALLBACK - Si DuckDuckGo no encuentra nada, intentar Google Images
    console.log(`⚠️ No se encontraron páginas de productos, probando Google Images como fallback...\n`);
    const images = await searchGoogleImages(searchQuery);
    if (images && images.length > 0) {
        console.log(`⚠️ ADVERTENCIA: Usando Google Images sin verificación de relevancia`);
        return {
            productName: searchQuery,
            selectedImage: { url: images[0] },
            allImages: images.map(url => ({ url })),
            method: 'google_images_unverified',
            note: '⚠️ Imagen de Google Images (sin verificar relevancia). Puede no ser el producto exacto.'
        };
    }

    throw new Error(`No se encontraron resultados para "${searchQuery}". Intenta con la URL directa del producto.`);
}

module.exports = {
    smartExtractProductImage,
    extractOpenGraphImage,
    searchGoogleImages,
    searchGoogleWeb,
    searchDuckDuckGo,
    calculateSimilarity,
    calculateRelevanceScore
};
