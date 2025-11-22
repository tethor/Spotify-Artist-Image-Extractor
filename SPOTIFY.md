Aquí tienes la información estructurada en formato Markdown para colocar en un archivo `.md`, ideal para agregar como guía en tu repositorio y compartir los pasos de automatización:

```markdown
# Guía de Deploy - Spotify Artist Image Extractor

## Requisitos
- Node.js v16 o superior
- Cuenta gratuita en Render.com
- Spotify API Client ID y Secret
- Opcional: Token gratuito de Browserless.io para mejorar Puppeteer

## Pasos para el Deploy Automatizado en Render.com

### 1. Clonar el repositorio
```

git clone https://github.com/tethor/Spotify-Artist-Image-Extractor.git

```

### 2. Instalar dependencias
```

npm install

```

### 3. Crear archivo `.env`
Agrega tus credenciales reales:
```

SPOTIFY_CLIENT_ID=tu_client_id_de_spotify
SPOTIFY_CLIENT_SECRET=tu_client_secret_de_spotify

# Opcional para Puppeteer rápido:

# BROWSERLESS_TOKEN=tu_browserless_token

```

### 4. Crear archivo `render.yaml` en raíz
```

services:

- type: web
name: spotify-artist-image-extractor
env: node
repo: https://github.com/tethor/Spotify-Artist-Image-Extractor
branch: main
buildCommand: 'npm install'
startCommand: 'npm start'
envVars:
    - key: SPOTIFY_CLIENT_ID
value: tu_client_id_de_spotify
    - key: SPOTIFY_CLIENT_SECRET
value: tu_client_secret_de_spotify


# Descomenta si usas Browserless

# - key: BROWSERLESS_TOKEN

# value: tu_browserless_token

autoDeploy: true

```

### 5. Subir los cambios
```

git add .env render.yaml
git commit -m "Add environment and Render config"
git push

```

### 6. Conectar y desplegar en Render.com
- Ve a https://render.com
- Crea una cuenta y conecta tu repo de GitHub
- Render detectará el archivo `render.yaml` y levantará la app automáticamente
- Tendrás acceso a un dominio gratuito para compartir la herramienta

## Notas
- Si solo usas el modo API (sin Puppeteer), puedes usar Vercel o Netlify siguiendo pasos similares, pero Render es recomendable para ambos modos.
- Railway.app es una alternativa con pasos análogos y interfaz sencilla.

---

Esta guía permite que una IA o asistente edite tu proyecto y lo deje listo para deploy sin intervención manual, empleando Render.com como plataforma gratuita y compatible con Puppeteer[attached_file:1][web:7][web:19][web:13].
```

<span style="display:none">[^1][^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.e-iceblue.com/es/doc/convert-markdown-to-html.html

[^2]: https://www.reddit.com/r/ChatGPTCoding/comments/1kbw9m2/how_to_convert_github_repo_to_markdown/

[^3]: https://markdowntohtml.com

[^4]: https://learn.microsoft.com/es-es/connectors/markdownconverter/

[^5]: https://blog.openize.com/es/markitdown/convert-word-to-markdown-using-python/

[^6]: https://www.glukhov.org/es/post/2025/09/converting-word-document-to-markdown/

[^7]: https://www.markdownlang.com/es/advanced/tools.html

[^8]: https://www.tiktok.com/@midudev/video/7456539676862729505

[^9]: https://www.youtube.com/watch?v=oxaH9CFpeEE

[^10]: https://carlosseijas.com/blog/como-utilizar-markdown

