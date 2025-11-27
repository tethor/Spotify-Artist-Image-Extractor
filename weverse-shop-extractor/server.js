const express = require('express');
const cors = require('cors');
const { searchProductOnWeverse, extractProductImage, extractImagesFromList } = require('./puppeteer-product');
const { smartExtractProductImage, extractOpenGraphImage } = require('./smart-extractor');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Helper para validar token de Browserless
 */
function isValidBrowserlessToken(token) {
  return token && token !== 'your_browserless_token_here' && token.trim() !== '';
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API endpoint para buscar y extraer imagen de producto
app.post('/api/extract-product-image', async (req, res) => {
  try {
    const { searchQuery, productUrl } = req.body;

    if (!searchQuery && !productUrl) {
      return res.status(400).json({ error: 'Se requiere searchQuery o productUrl' });
    }

    // Si es una URL directa, extraer Open Graph directamente
    if (productUrl || (searchQuery && searchQuery.startsWith('http'))) {
      const url = productUrl || searchQuery;
      console.log(`Extrayendo imagen de URL directa: ${url}`);
      
      const result = await extractOpenGraphImage(url);
      
      if (result && result.imageUrl) {
        return res.json({
          productName: result.productName,
          productUrl: url,
          selectedImage: { url: result.imageUrl },
          allImages: [{ url: result.imageUrl }],
          method: 'open_graph',
          note: `Imagen extraída de ${result.source}`
        });
      }
      
      // Fallback a puppeteer si Open Graph falla
      console.log('Open Graph falló, intentando con Puppeteer...');
    }

    // Si no se proporciona URL directa, usar ESTRATEGIA INTELIGENTE
    if (searchQuery && !searchQuery.startsWith('http')) {
      console.log(`🧠 Usando ESTRATEGIA INTELIGENTE para: "${searchQuery}"`);
      
      try {
        const result = await smartExtractProductImage(searchQuery);
        return res.json(result);
      } catch (smartError) {
        console.error('❌ Estrategia inteligente falló:', smartError.message);
        console.log('⚠️ Fallback a Puppeteer...');
      }
    }

    // FALLBACK: Usar el sistema anterior con Puppeteer
    let finalProductUrl = productUrl;
    let productName = 'Producto';

    if (!finalProductUrl && searchQuery) {
      
      const browserlessToken = process.env.BROWSERLESS_TOKEN;
      const useLocalBrowser = !isValidBrowserlessToken(browserlessToken);

      let searchResult;
      let usedFallback = false;
      let browserType = 'Unknown';

      if (useLocalBrowser) {
        usedFallback = true;
        browserType = 'Local Chrome';
        // Temporalmente deshabilitar token para forzar uso local
        const originalToken = process.env.BROWSERLESS_TOKEN;
        process.env.BROWSERLESS_TOKEN = '';

        try {
          searchResult = await searchProductOnWeverse(searchQuery);
          if (searchResult) {
            searchResult.browserType = browserType;
          }
        } catch (error) {
          console.error('❌ Error en búsqueda local:', error.message);
          return res.status(500).json({
            error: 'Error al buscar producto',
            details: error.message,
            suggestion: 'Asegúrate de tener Chrome/Chromium instalado o conexión a internet para la primera descarga'
          });
        } finally {
          process.env.BROWSERLESS_TOKEN = originalToken;
        }
      } else {

        try {
          searchResult = await searchProductOnWeverse(searchQuery);
          browserType = 'Browserless.io';
        } catch (error) {
          console.error('❌ Error en Browserless.io:', error.message);

          if (error.message && (error.message.includes('401') || error.message.includes('403'))) {

            const originalToken = process.env.BROWSERLESS_TOKEN;
            process.env.BROWSERLESS_TOKEN = '';

            try {
              searchResult = await searchProductOnWeverse(searchQuery);
              usedFallback = true;
              browserType = 'Local Chrome (fallback)';
            } catch (fallbackError) {
              console.error('❌ Fallback local también falló:', fallbackError.message);

              return res.status(500).json({
                error: 'Error al buscar producto',
                details: `Browserless: ${error.message} | Local: ${fallbackError.message}`,
                suggestion: 'Verifica tu token de Browserless o instalación de Chrome'
              });
            } finally {
              process.env.BROWSERLESS_TOKEN = originalToken;
            }
          } else {
            return res.status(500).json({
              error: 'Error al buscar producto en Browserless.io',
              details: error.message
            });
          }
        }
      }

      if (!searchResult) {
        return res.status(404).json({ error: 'No se encontró el producto en Weverse Shop' });
      }

      // Si searchResult es un array (múltiples resultados), SIEMPRE extraer imágenes para cada uno
      if (Array.isArray(searchResult)) {
        // Pasar searchQuery para que calcule similitud con títulos REALES de Weverse
        // IMPORTANTE: Siempre extraer imágenes, nunca devolver solo resultados de búsqueda
        const resultsWithImages = await extractImagesFromList(searchResult, searchQuery);
        
        // Filtrar resultados que no tienen imagen (no queremos mostrar resultados sin imágenes)
        const resultsWithValidImages = resultsWithImages.filter(r => r.imageUrl);
        
        if (resultsWithValidImages.length === 0) {
          return res.status(404).json({ 
            error: 'No se pudieron extraer imágenes de los productos encontrados. Intenta con una búsqueda diferente o URL directa.' 
          });
        }
        
        // Si después de calcular similitud con títulos reales solo queda 1, tratarlo como resultado único
        if (resultsWithValidImages.length === 1) {
            finalProductUrl = resultsWithValidImages[0].url;
            productName = resultsWithValidImages[0].name;
            // Continuar al flujo de extracción única (no retornar aquí)
        } else {
            // Múltiples resultados con imágenes válidas, mostrar opciones
            return res.json({
                multipleResults: true,
                results: resultsWithValidImages
            });
        }
      } else {
        // Resultado único desde el inicio
        finalProductUrl = searchResult.url;
        productName = searchResult.name || 'Producto';
      }

    }
    
    // Si llegamos aquí sin finalProductUrl, significa que hubo un error
    if (!finalProductUrl) {
      return res.status(404).json({ error: 'No se pudo determinar la URL del producto' });
    }

    // Extraer imagen del producto
    const browserlessToken = process.env.BROWSERLESS_TOKEN;
    const useLocalBrowser = !isValidBrowserlessToken(browserlessToken);

    let imageResult;
    let usedFallback = false;
    let browserType = 'Unknown';

    if (useLocalBrowser) {
      usedFallback = true;
      browserType = 'Local Chrome';
      const originalToken = process.env.BROWSERLESS_TOKEN;
      process.env.BROWSERLESS_TOKEN = '';

      try {
        imageResult = await extractProductImage(finalProductUrl);
        if (imageResult) {
          imageResult.browserType = browserType;
        }
      } catch (error) {
        console.error('❌ Error en extracción local:', error.message);
        return res.status(500).json({
          error: 'Error al extraer imagen del producto',
          details: error.message,
          suggestion: 'Asegúrate de tener Chrome/Chromium instalado'
        });
      } finally {
        process.env.BROWSERLESS_TOKEN = originalToken;
      }
    } else {

      try {
        imageResult = await extractProductImage(finalProductUrl);
        browserType = 'Browserless.io';
      } catch (error) {
        console.error('❌ Error en Browserless.io:', error.message);

        if (error.message && (error.message.includes('401') || error.message.includes('403'))) {

          const originalToken = process.env.BROWSERLESS_TOKEN;
          process.env.BROWSERLESS_TOKEN = '';

          try {
            imageResult = await extractProductImage(finalProductUrl);
            usedFallback = true;
            browserType = 'Local Chrome (fallback)';
          } catch (fallbackError) {
            console.error('❌ Fallback local también falló:', fallbackError.message);

            return res.status(500).json({
              error: 'Error al extraer imagen del producto',
              details: `Browserless: ${error.message} | Local: ${fallbackError.message}`,
              suggestion: 'Verifica tu token de Browserless o instalación de Chrome'
            });
          } finally {
            process.env.BROWSERLESS_TOKEN = originalToken;
          }
        } else {
          return res.status(500).json({
            error: 'Error al extraer imagen en Browserless.io',
            details: error.message
          });
        }
      }
    }

    if (!imageResult || !imageResult.url) {
      return res.status(404).json({ error: 'No se encontró imagen del producto en esta página' });
    }

    // Usar el nombre del producto de la extracción si está disponible
    const finalProductName = imageResult.productName || productName;

    res.json({
      productName: finalProductName,
      productUrl: finalProductUrl,
      selectedImage: {
        url: imageResult.url,
        width: null, // Las imágenes de Weverse pueden variar
        height: null
      },
      allImages: [{ url: imageResult.url }],
      method: 'puppeteer_scraper',
      note: 'Imagen extraída de Weverse Shop',
      browserType: browserType || imageResult.browserType,
      usedLocalFallback: usedFallback
    });

  } catch (error) {
    console.error('Error procesando solicitud:', error.message);
    res.status(500).json({ error: 'Error al extraer imagen del producto', details: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Servidor Weverse Shop Extractor ejecutándose en puerto ${PORT}`);
  console.log(`Visita http://localhost:${PORT} para usar la aplicación`);
});

module.exports = app;

