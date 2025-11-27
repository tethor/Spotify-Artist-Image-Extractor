# 🛍️ Weverse Shop Image Extractor

Una aplicación web avanzada que extrae imágenes de productos de alta calidad desde Weverse Shop mediante búsqueda inteligente de mercancía K-pop (lightsticks, álbumes, etc.).

## ✨ Características Principales

- **🔍 Búsqueda Inteligente Multi-Motor**: Busca productos usando DuckDuckGo, Google y Bing como fallback
- **🎯 Similitud Avanzada**: Algoritmo de Levenshtein para comparar títulos reales de productos (no solo resultados de búsqueda)
- **🖼️ Extracción Automática de Imágenes**: Visita cada página de producto y extrae la imagen principal
- **🤖 Anti-Bot Stealth**: Usa `puppeteer-extra-plugin-stealth` para evitar detección
- **⚡ Optimización de Rendimiento**: Bloqueo de recursos innecesarios (fuentes, media) para velocidad máxima
- **🎨 Interfaz Neo-Brutalist**: Diseño moderno, responsive y bilingüe (Español/Inglés)
- **📥 Descarga Inteligente**: Nombres de archivo limpios basados en el nombre del producto
- **☁️ Soporte Browserless.io**: Opción de usar navegador en la nube para producción
- **🔄 Fallback Automático**: Si Browserless falla, usa Chrome local automáticamente

## 🚀 Cómo Funciona

### Flujo de Extracción Inteligente

1. **Búsqueda Multi-Motor**:
   - Intenta primero con `site:shop.weverse.io` en DuckDuckGo (más rápido y privado)
   - Si falla, búsqueda amplia en DuckDuckGo
   - Luego `site:shop.weverse.io` en Google
   - Si falla, búsqueda amplia en Google
   - Fallback final a Bing

2. **Extracción de Títulos Reales**:
   - Obtiene los top 3 resultados de Weverse Shop
   - **Entra a cada página** y extrae el título REAL del producto
   - Extrae la imagen principal de cada producto

3. **Comparación Inteligente**:
   - Calcula similitud de Levenshtein entre tu búsqueda y los títulos REALES
   - Si encuentra un match ≥85%: muestra solo ese producto
   - Si no: muestra las 3 mejores opciones para que elijas

4. **Resultado**:
   - Imágenes reales extraídas de Weverse Shop
   - Nunca muestra solo previews de Google
   - Descarga con nombre limpio del producto

## 🛠️ Instalación

### Requisitos Previos

- **Node.js** v16 o superior
- **npm** o **yarn**
- **Chrome/Chromium** (se descarga automáticamente en el primer uso)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/weverse-shop-extractor.git
cd weverse-shop-extractor

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor (¡listo para usar!)
npm run dev  # Desarrollo con auto-reload
# o
npm start    # Producción
```

El servidor estará disponible en `http://localhost:3001`

**Nota:** No necesitas crear un archivo `.env`. El sistema funciona perfectamente con Chrome local sin configuración adicional.

## ⚙️ Configuración (Opcional)

**El sistema funciona sin configuración adicional.** Chrome local se usa automáticamente.

Si deseas usar Browserless.io para mejor rendimiento en producción, crea un archivo `.env`:

```bash
# OPCIONAL: Token de Browserless.io para producción
# Obtén uno gratis en https://www.browserless.io/
# Si no se proporciona, usa Chrome local automáticamente
BROWSERLESS_TOKEN=tu_token_aqui

# OPCIONAL: Puerto del servidor (por defecto 3001)
PORT=3001
```

**Sin archivo `.env`:**
- ✅ Funciona perfectamente
- ✅ Usa Chrome local
- ✅ Descarga Chrome automáticamente en el primer uso (~300MB)
- ✅ Sin costos adicionales

**Con Browserless.io (opcional):**
- ⚡ Más rápido (sin descargas locales)
- ☁️ Ideal para producción/servidores
- 💰 Plan gratuito disponible

### Comportamiento de Navegadores

| Escenario | Navegador Usado | Notas |
|-----------|----------------|-------|
| **Sin archivo `.env`** | **Chrome Local** | **Configuración por defecto** ✅ |
| Token válido de Browserless | Browserless.io | Más rápido, sin descargas locales |
| Token inválido/vacío | Chrome Local | Descarga Chrome (~300MB) en primer uso |
| Browserless falla (401/403) | Chrome Local (fallback) | Automático, sin intervención |

## 📖 Uso

### Interfaz Web

1. Abre `http://localhost:3001`
2. Ingresa el nombre del producto (ej: `BLACKPINK LIGHTSTICK`)
3. Haz clic en **"EXTRAER IMAGEN"**
4. Espera mientras el sistema:
   - Busca en DuckDuckGo/Google/Bing
   - Entra a las páginas de Weverse Shop
   - Extrae títulos e imágenes reales
   - Calcula similitud
5. Descarga la imagen con el botón **"DESCARGAR IMAGEN"**

### API REST

#### `POST /api/extract-product-image`

Extrae imágenes de productos desde Weverse Shop.

**Request Body:**
```json
{
  "searchQuery": "BLACKPINK OFFICIAL LIGHT STICK"
}
```

**Response (Resultado Único):**
```json
{
  "productName": "BLACKPINK OFFICIAL LIGHT STICK VER.2",
  "productUrl": "https://shop.weverse.io/en/shop/USD/artists/32/sales/9619",
  "selectedImage": {
    "url": "https://cdn-contents.weverseshop.io/public/shop/...",
    "width": null,
    "height": null
  },
  "allImages": [{ "url": "..." }],
  "method": "puppeteer_scraper",
  "note": "Imagen extraída de Weverse Shop",
  "browserType": "Local Chrome",
  "usedLocalFallback": false
}
```

**Response (Múltiples Resultados):**
```json
{
  "multipleResults": true,
  "results": [
    {
      "name": "BLACKPINK OFFICIAL LIGHT STICK VER.2",
      "url": "https://shop.weverse.io/...",
      "imageUrl": "https://cdn-contents.weverseshop.io/...",
      "googleTitle": "BLACKPINK Official Light..."
    },
    // ... más resultados
  ]
}
```

## 🔧 Arquitectura Técnica

### Stack Tecnológico

- **Backend**: Node.js + Express
- **Web Scraping**: Puppeteer Core + Puppeteer Extra + Stealth Plugin
- **Navegador**: @sparticuz/chromium (para entornos serverless)
- **Frontend**: HTML5 + CSS3 (Neo-Brutalist) + Vanilla JavaScript
- **Búsqueda**: DuckDuckGo + Google Search + Bing (fallbacks)
- **Similitud**: Algoritmo de Levenshtein (distancia de edición)

### Optimizaciones Implementadas

1. **Bloqueo de Recursos**: Fuentes y media bloqueadas para velocidad
2. **Procesamiento Paralelo**: Extrae imágenes de múltiples productos simultáneamente
3. **Selectores Optimizados**: Solo busca divs relevantes (no todos los divs de la página)
4. **User-Agent Actualizado**: Chrome 131 para evitar detección como bot
5. **Stealth Plugin**: Evita detección de Puppeteer por sistemas anti-bot
6. **Fallback Robusto**: Múltiples motores de búsqueda y navegadores

### Flujo de Datos

```
Usuario → Frontend → Express API
                        ↓
            searchProductOnWeverse()
                        ↓
        Google/DDG/Bing Search (Top 3)
                        ↓
        extractImagesFromList(results, query)
                        ↓
    Visita cada URL + Extrae título real + imagen
                        ↓
        Calcula similitud con títulos reales
                        ↓
    ≥85% similitud? → 1 resultado : 3 opciones
                        ↓
            Frontend muestra imágenes
```

## 🐛 Solución de Problemas

### Error: "No se encontraron resultados"

**Causas posibles:**
- Producto no disponible en Weverse Shop
- Nombre de búsqueda muy específico o incorrecto
- Bloqueo temporal por Google/DuckDuckGo

**Soluciones:**
- Intenta con términos más generales (ej: "BLACKPINK LIGHTSTICK" en lugar de "BLACKPINK OFFICIAL LIGHT STICK SPECIAL EDITION")
- Usa la URL directa del producto si la tienes
- Espera unos minutos y reintenta

### Error: "Unexpected server response: 401"

**Causa:** Token de Browserless.io inválido o expirado

**Solución:**
```bash
# Opción 1: Eliminar el token del .env
BROWSERLESS_TOKEN=

# Opción 2: Obtener un token válido en https://www.browserless.io/
```

### Primera ejecución muy lenta

**Causa:** Descarga de Chrome (~300MB)

**Solución:** Espera pacientemente. Las siguientes ejecuciones serán mucho más rápidas.

### Imágenes no se cargan

**Causas posibles:**
- Timeout de red
- Página de Weverse cambió estructura
- Recursos bloqueados por CORS

**Soluciones:**
- Verifica tu conexión a internet
- Revisa los logs del servidor (`npm run dev`)
- Reporta el issue en GitHub

## 📊 Rendimiento

| Escenario | Tiempo Estimado |
|-----------|----------------|
| Primera ejecución (descarga Chrome) | 30-60 segundos |
| Búsqueda + Extracción (Chrome local) | 10-15 segundos |
| Búsqueda + Extracción (Browserless.io) | 5-8 segundos |
| Extracción con URL directa | 3-5 segundos |

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Áreas de Mejora

- [ ] Soporte para más sitios de K-pop merchandise
- [ ] Cache de resultados para búsquedas frecuentes
- [ ] Modo batch para múltiples productos
- [ ] API de comparación de precios
- [ ] Notificaciones de disponibilidad de productos

## 📜 Licencia

Este proyecto está licenciado bajo **MIT License**.

```
MIT License

Copyright (c) 2024 POCAPAY GO

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## ⚠️ Disclaimer

**Este proyecto es solo para uso educativo y personal.**

- Las imágenes de productos son propiedad de sus respectivos artistas y sellos discográficos
- Este proyecto NO está afiliado con Weverse Company Inc.
- Los usuarios son responsables de cumplir con los términos de servicio de Weverse Shop
- El autor no se hace responsable del mal uso de esta herramienta
- Respeta los derechos de autor y la propiedad intelectual

---

## 🙏 Agradecimientos

- **Weverse Shop** por proporcionar una plataforma increíble para la comunidad K-pop
- **Puppeteer Team** por la excelente herramienta de automatización
- **Comunidad K-pop** por el apoyo continuo

---

**Hecho con 💜 por [POCAPAY GO](https://pocapay.com) para la comunidad K-pop**

*Síguenos en Instagram: [@pocapay_mx](https://www.instagram.com/pocapay_mx/)*

---

*Weverse Shop es una marca registrada de Weverse Company Inc. Este proyecto no está afiliado, asociado, autorizado, respaldado por, o de ninguna manera oficialmente conectado con Weverse Company Inc.*
