# 🎵 POCAPAY GO - E-commerce K-POP Store

<div align="center">

![POCAPAY GO](https://img.shields.io/badge/POCAPAY-GO-ff69b4?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**La tienda online #1 de álbumes, merchandising y artículos K-POP en México** 🇲🇽

[🌐 Sitio Web](https://pocapay.com) · [📧 Contacto](mailto:pocapay@pocapay.com) · [📱 Instagram](#) · [🎮 Discord](#)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Desarrollo](#-desarrollo)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Infraestructura](#-infraestructura)
- [Pasarelas de Pago](#-pasarelas-de-pago)
- [Contribuir](#-contribuir)
- [Roadmap](#️-roadmap)
- [Licencia](#-licencia)
- [Equipo](#-equipo)

---

## 🎯 Acerca del Proyecto

**POCAPAY GO** es una plataforma de e-commerce especializada en la venta de álbumes, merchandising oficial y artículos relacionados con K-POP en México. Desarrollada con las últimas tecnologías web y enfocada en ofrecer la mejor experiencia de compra a los fans del K-POP.

### 🌟 Misión
Ser la tienda online líder en México para productos K-POP auténticos, ofreciendo:
- ✅ **Productos 100% Oficiales**
- ✅ **Envíos Rápidos y Seguros**
- ✅ **Precios Competitivos**
- ✅ **Servicio al Cliente Excepcional**
- ✅ **Preventas Exclusivas**

### 🎯 Objetivos
- Sistema de gestión financiera completo
- Página web de e-commerce profesional
- Sistema de órdenes y pedidos automatizado
- Gestión de inventario en tiempo real
- CRM para clientes
- Analytics y reportes avanzados
- Integración con pasarelas de pago mexicanas
- Sistema de envíos y logística

---

## ✨ Características Principales

### 🛍️ E-commerce
- 🔍 **Búsqueda avanzada** con filtros por artista, grupo, álbum, versión y precio
- 🎨 **Catálogo visual** con imágenes de alta calidad
- 🛒 **Carrito inteligente** con persistencia
- 💳 **Checkout optimizado** multi-paso
- 🎟️ **Sistema de cupones** y descuentos
- ⭐ **Reviews y ratings** de productos
- 📦 **Sistema de preventas** (pre-orders)
- 💝 **Wishlist** personalizada

### 👤 Gestión de Clientes
- 🔐 **Autenticación segura** con NextAuth.js
- 👥 **Perfiles de usuario** personalizables
- 📜 **Historial de pedidos** completo
- 🎁 **Programa de lealtad** con puntos
- 📧 **Notificaciones** por email y WhatsApp
- 🌟 **Sistema de "bias"** (artista favorito)
- 💬 **CRM & Soporte** con Chatwoot (ver [análisis](./CHATWOOT-ANALISIS.md))

### 📊 Panel de Administración
- 📈 **Dashboard ejecutivo** en tiempo real
- 📦 **Gestión de productos** (CRUD completo)
- 📋 **Gestión de órdenes** con estados
- 💰 **Reportes financieros** avanzados
- 👥 **Gestión de usuarios** y roles
- 🚚 **Integración con paqueterías**
- 📊 **Analytics** con métricas clave

### 💳 Pagos y Facturación
- 💳 **Mercado Pago** - Tarjetas, OXXO, SPEI, MSI
- 🧾 **Facturación electrónica** CFDI 4.0
- 🔒 **Pagos seguros** con 3D Secure
- 💰 **Múltiples métodos** de pago

### 🚚 Envíos
- 📦 **Integración** con Paquetexpress, Estafeta, DHL
- 📍 **Tracking** en tiempo real
- 💰 **Cálculo automático** de costos
- 📋 **Generación de guías** automática
- 📬 **Notificaciones** de entrega

---

## 🛠️ Stack Tecnológico

### Frontend
```
├── Next.js 16         → Framework React con Server Components
├── React 19           → Biblioteca UI
├── TypeScript 5       → Tipado estático
├── Tailwind CSS 4     → Framework CSS utility-first
├── shadcn/ui          → Componentes UI accesibles
├── Zustand            → Gestión de estado
├── React Query        → Server state management
├── React Hook Form    → Manejo de formularios
└── Zod                → Validación de esquemas
```

### Backend
```
├── Next.js API Routes → Endpoints API
├── Prisma ORM         → ORM para PostgreSQL
├── NextAuth.js        → Autenticación
├── PostgreSQL         → Base de datos
├── Chatwoot           → CRM & Customer Support (Open Source)
└── tRPC (futuro)      → APIs type-safe
```

### Infraestructura
```
├── Dokploy            → PaaS Open Source (self-hosted)
├── Docker             → Containerización
├── PostgreSQL         → Base de datos principal
├── Redis              → Cache y sesiones
├── Cloudflare         → CDN y DNS
├── Cloudflare R2      → Storage y backups
└── Let's Encrypt      → SSL/TLS automático
```

### Pagos y Servicios
```
├── Mercado Pago       → Pasarela de pagos principal
├── Larksuite          → Email corporativo
├── Chatwoot           → CRM & Customer Support (Open Source)
├── Paquetexpress      → API de envíos
├── Estafeta           → API de envíos
└── Resend/SendGrid    → Email transaccional (futuro)
```

### DevTools
```
├── Git + GitHub       → Control de versiones
├── ESLint             → Linter
├── Prettier           → Code formatter
├── Husky              → Git hooks
└── TSX                → TypeScript executor
```

---

## 🚀 Instalación

### Prerequisitos

Asegúrate de tener instalado:
- **Node.js** 20.x o superior
- **npm** o **pnpm** o **yarn**
- **PostgreSQL** 15.x o superior
- **Git**

### Clonar el Repositorio

```bash
git clone https://github.com/pocapay/pocapay-go-store.git
cd pocapay-go-store
```

### Instalar Dependencias

```bash
# Con npm
npm install

# Con pnpm (recomendado)
pnpm install

# Con yarn
yarn install
```

---

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/pocapay_db"

# NextAuth
NEXTAUTH_SECRET="tu-secret-key-muy-segura-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Mercado Pago
MERCADO_PAGO_PUBLIC_KEY="tu-public-key"
MERCADO_PAGO_ACCESS_TOKEN="tu-access-token"

# Email (Larksuite/Resend)
EMAIL_SERVER_USER="smtp-user"
EMAIL_SERVER_PASSWORD="smtp-password"
EMAIL_SERVER_HOST="smtp.larksuite.com"
EMAIL_SERVER_PORT="587"
EMAIL_FROM="noreply@pocapay.com"

# Cloudflare R2 (Storage)
R2_ACCOUNT_ID="tu-account-id"
R2_ACCESS_KEY_ID="tu-access-key"
R2_SECRET_ACCESS_KEY="tu-secret-key"
R2_BUCKET_NAME="pocapay-uploads"

# Shipping APIs
PAQUETEXPRESS_API_KEY="tu-api-key"
ESTAFETA_API_KEY="tu-api-key"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 2. Base de Datos

#### Crear la base de datos

```bash
# PostgreSQL
createdb pocapay_db
```

#### Generar el cliente Prisma

```bash
npm run db:generate
```

#### Ejecutar migraciones

```bash
npm run db:migrate
```

#### Sembrar datos iniciales (opcional)

```bash
npm run db:seed
```

### 3. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Build
npm run build           # Crear build de producción
npm run start           # Iniciar servidor de producción

# Linting
npm run lint            # Ejecutar ESLint

# Base de Datos
npm run db:generate     # Generar cliente Prisma
npm run db:push         # Push schema a DB (sin migraciones)
npm run db:migrate      # Crear y ejecutar migraciones
npm run db:studio       # Abrir Prisma Studio
npm run db:seed         # Sembrar datos iniciales
```

---

## 🗄️ Gestión de Base de Datos con Prisma

### Estrategia de Migrations

POCAPAY GO utiliza Prisma ORM 6.19.0 con un enfoque de **migration-first** para garantizar consistencia entre ambientes.

### Workflow de Desarrollo Local

#### 1. Generar Prisma Client

Cada vez que modifiques el schema, genera el cliente de TypeScript:

```bash
npm run db:generate
# o directamente:
npx prisma generate
```

Esto actualiza los tipos de TypeScript para tener autocompletado correcto.

#### 2. Crear y Aplicar Migraciones

Cuando hagas cambios al schema, crea una migración:

```bash
npm run db:migrate
# o con nombre descriptivo:
npx prisma migrate dev --name add_product_images
```

**Qué hace este comando:**
1. Compara el schema con la base de datos
2. Genera SQL para los cambios
3. Aplica la migración a tu base de datos local
4. Regenera el Prisma Client automáticamente

**Ejemplo de nombres de migraciones:**
```bash
npx prisma migrate dev --name init                    # Migración inicial
npx prisma migrate dev --name add_user_roles          # Agregar roles de usuario
npx prisma migrate dev --name add_cart_items          # Agregar items del carrito
npx prisma migrate dev --name fix_product_status_enum # Corrección de enum
```

#### 3. Sembrar Datos de Prueba

Para poblar la base de datos con datos iniciales:

```bash
npm run db:seed
```

**Archivo seed:** `/prisma/seed.ts`

Ejemplo de seed para POCAPAY GO:

```typescript
// prisma/seed.ts
import { PrismaClient, UserRole, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear categorías
  const albumCategory = await prisma.category.create({
    data: {
      name: 'Álbumes',
      slug: 'albumes',
      description: 'Álbumes físicos de K-POP'
    }
  })

  // Crear usuario admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@pocapay.com',
      name: 'Admin POCAPAY',
      role: UserRole.ADMIN
    }
  })

  // Crear productos de ejemplo
  const product = await prisma.product.create({
    data: {
      name: 'BTS - Map of the Soul: 7',
      slug: 'bts-map-of-the-soul-7',
      description: 'Álbum físico BTS versión 1',
      price: 45900, // Precio en centavos
      stock: 10,
      status: ProductStatus.PUBLISHED,
      categoryId: albumCategory.id,
      artist: 'BTS',
      releaseDate: new Date('2020-02-21')
    }
  })

  console.log({ admin, albumCategory, product })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

#### 4. Abrir Prisma Studio

Prisma Studio es una interfaz visual para gestionar datos:

```bash
npm run db:studio
# o directamente:
npx prisma studio
```

Abre en `http://localhost:5555` y permite:
- Ver todas las tablas
- Crear, editar, eliminar registros
- Filtrar y buscar datos
- Explorar relaciones

### Workflow de Producción (Dokploy)

#### 1. Aplicar Migraciones en Producción

**⚠️ IMPORTANTE:** En producción, usa `migrate deploy` (NO `migrate dev`):

```bash
npx prisma migrate deploy
```

**Diferencias clave:**
- `migrate dev`: Crea nuevas migraciones, resetea la DB si es necesario
- `migrate deploy`: Solo aplica migraciones pendientes, nunca resetea

**En Dokploy:**

1. Las migraciones se aplican automáticamente en el build
2. Configurado en `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

#### 2. Rollback de Migraciones

Si necesitas revertir una migración:

```bash
# Ver historial de migraciones
npx prisma migrate status

# Revertir última migración (SOLO EN DESARROLLO)
npx prisma migrate resolve --rolled-back [nombre-de-migracion]
```

**⚠️ En producción:** Crea una nueva migración que revierta los cambios.

### Mejores Prácticas

#### ✅ DO (Hacer)

1. **Siempre usa migraciones** - Nunca uses `db:push` en producción
2. **Nombra migraciones descriptivamente** - `add_product_variants` en lugar de `migration_1`
3. **Revisa el SQL generado** - Verifica el archivo `.sql` antes de aplicar
4. **Crea backups antes de migraciones grandes** - Usa `pg_dump` o el backup de Dokploy
5. **Prueba migraciones en staging primero** - Antes de aplicar en producción
6. **Usa seed para datos iniciales** - Categorías, roles, configuración inicial
7. **Versionea las migraciones en Git** - Incluye la carpeta `/prisma/migrations`

#### ❌ DON'T (No hacer)

1. **No uses `db:push` en producción** - Puede causar pérdida de datos
2. **No edites migraciones ya aplicadas** - Crea una nueva migración
3. **No hagas reset en producción** - Nunca uses `migrate reset` en prod
4. **No ignores warnings de Prisma** - Si dice que puede perder datos, ¡escucha!
5. **No compartas DATABASE_URL en código** - Usa variables de entorno
6. **No corras migraciones manualmente sin CI/CD** - Automatiza el proceso

### Comandos de Referencia Rápida

```bash
# Desarrollo Local
npx prisma generate              # Genera TypeScript types
npx prisma migrate dev           # Crea y aplica migración
npx prisma migrate dev --name X  # Con nombre descriptivo
npx prisma migrate reset         # ⚠️ Resetea DB (SOLO DEV)
npx prisma studio                # Abre interfaz visual
npx prisma db seed               # Siembra datos

# Producción
npx prisma generate              # Genera client
npx prisma migrate deploy        # Aplica migraciones pendientes
npx prisma migrate status        # Ver estado de migraciones

# Debugging
npx prisma migrate diff           # Ver diferencias de schema
npx prisma validate              # Validar schema.prisma
npx prisma format                # Formatear schema.prisma

# Avanzado
npx prisma migrate resolve --applied [name]      # Marcar como aplicada
npx prisma migrate resolve --rolled-back [name]  # Marcar como revertida
```

### Optimización de Performance con Prisma 6

#### 1. Join Strategy (Nuevo en Prisma 6)

```typescript
// ❌ Query Strategy (por defecto, hace múltiples queries)
const users = await prisma.user.findMany({
  include: { posts: true }
})

// ✅ Join Strategy (1 query con JOIN)
const users = await prisma.user.findMany({
  relationLoadStrategy: "join",
  include: { posts: true }
})
```

**Resultado:** Hasta 3x más rápido en relaciones complejas.

#### 2. Prevenir N+1 Queries

```typescript
// ❌ N+1 Problem
const products = await prisma.product.findMany()
for (const product of products) {
  const category = await prisma.category.findUnique({
    where: { id: product.categoryId }
  })
}

// ✅ Solución: Include + Join
const products = await prisma.product.findMany({
  relationLoadStrategy: "join",
  include: { category: true }
})
```

#### 3. Índices Estratégicos

Según el schema de POCAPAY GO, ya tenemos índices en:

```prisma
model Product {
  // ...
  @@index([categoryId])
  @@index([status])
  @@index([createdAt])
}

model Order {
  // ...
  @@index([userId])
  @@index([status])
  @@index([createdAt])
}
```

**Beneficio:** Queries hasta 100x más rápidas en tablas grandes.

### Troubleshooting Común

#### Error: "Migration failed to apply"

```bash
# Ver estado
npx prisma migrate status

# Si aparece "drift detected" (cambios manuales en DB)
npx prisma db pull  # Actualiza schema desde DB
# o
npx prisma migrate resolve --applied [name]  # Marca como aplicada
```

#### Error: "Prisma Client is not generated"

```bash
# Regenera el cliente
npm run db:generate
# o
npx prisma generate
```

#### Error: "Connection pool timeout"

Aumenta el connection pool en `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")

  // Aumentar pool para producción
  shadowDatabaseUrl = env("SHADOW_DATABASE_URL")
  relationMode = "prisma"
}
```

O en `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=20&pool_timeout=20"
```

---

### Comandos Útiles

```bash
# Ver logs de Prisma
npx prisma studio

# Resetear base de datos
npx prisma migrate reset

# Formato de código
npx prettier --write .

# Type checking
npx tsc --noEmit
```

---

## 📁 Estructura del Proyecto

```
pocapay-go-store/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (auth)/            # Rutas de autenticación
│   │   ├── (shop)/            # Rutas de la tienda
│   │   ├── admin/             # Panel de administración
│   │   ├── api/               # API Routes
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes shadcn/ui
│   │   ├── cart/             # Componentes del carrito
│   │   ├── products/         # Componentes de productos
│   │   └── layout/           # Componentes de layout
│   ├── lib/                   # Utilidades y helpers
│   │   ├── prisma.ts         # Cliente Prisma
│   │   ├── utils.ts          # Funciones utilitarias
│   │   └── validations.ts    # Esquemas Zod
│   ├── hooks/                 # Custom React Hooks
│   ├── stores/               # Zustand stores
│   ├── types/                # TypeScript types
│   └── styles/               # Estilos globales
├── prisma/
│   ├── schema.prisma         # Esquema de base de datos
│   ├── migrations/           # Migraciones
│   └── seed.ts               # Script de seed
├── public/                    # Archivos estáticos
│   ├── images/               # Imágenes
│   └── fonts/                # Fuentes
├── components.json           # Configuración shadcn/ui
├── next.config.ts            # Configuración Next.js
├── tailwind.config.ts        # Configuración Tailwind
├── tsconfig.json             # Configuración TypeScript
├── .env                      # Variables de entorno
├── .env.example              # Ejemplo de variables
├── .gitignore                # Archivos ignorados por Git
├── package.json              # Dependencias y scripts
└── README.md                 # Este archivo
```

---

## 🏗️ Infraestructura

### Hosting con Dokploy (Open Source)

POCAPAY GO utiliza **Dokploy**, una alternativa open-source a Vercel/Netlify, que permite:

- ✅ **Self-hosting completo** en VPS
- ✅ **Despliegues automáticos** desde Git
- ✅ **SSL automático** con Let's Encrypt
- ✅ **PostgreSQL incluido**
- ✅ **Redis incluido**
- ✅ **Backups automáticos**
- ✅ **Monitoring integrado**
- ✅ **Zero-downtime deployments**

#### Costos Mensuales

```
💰 Infraestructura Total: ~$9-13 USD/mes

├── Dominio (Cloudflare)        : $1/mes
├── Email (Larksuite)           : $0/mes (plan gratuito)
├── CDN (Cloudflare)            : $0/mes
├── Dokploy                     : $0/mes (open source)
└── VPS 4GB (Contabo/Hetzner)   : $8-12/mes
    ├── App Next.js
    ├── PostgreSQL
    ├── Redis
    ├── Backups
    └── Monitoring

💸 vs Vercel + Supabase: $45-50/mes
💰 AHORRO ANUAL: ~$400-500 USD
```

### Arquitectura

```
┌─────────────────────────────────────────────┐
│           Cloudflare CDN/DNS                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              VPS (Dokploy)                  │
│  ┌─────────────────────────────────────┐   │
│  │        Docker Containers            │   │
│  │  ┌──────────┐  ┌──────────┐        │   │
│  │  │ Next.js  │  │PostgreSQL│        │   │
│  │  │   App    │  │    DB    │        │   │
│  │  └──────────┘  └──────────┘        │   │
│  │  ┌──────────┐  ┌──────────┐        │   │
│  │  │  Redis   │  │ Traefik  │        │   │
│  │  │  Cache   │  │  Proxy   │        │   │
│  │  └──────────┘  └──────────┘        │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 💳 Pasarelas de Pago

### Mercado Pago (Principal)

**Estado:** ✅ Implementado

**Métodos de pago disponibles:**
- 💳 Tarjetas de Crédito/Débito (Visa, Mastercard, Amex)
- 🏪 OXXO Pay (efectivo)
- 🏦 Transferencias SPEI
- 📱 Meses sin intereses (3, 6, 9, 12 MSI)
- 📲 QR Code payments

**Comisiones:**
- Tarjetas: 4.99% + $3 MXN
- OXXO/SPEI: 3.99% + $8 MXN
- Sin costo de setup ni mensualidad

### Stripe (Futuro)
Para pagos internacionales y tarjetas extranjeras.

### Conekta (Alternativa)
Backup y alternativa local mexicana.

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este es un proyecto privado, pero si eres parte del equipo:

### Proceso de Contribución

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Convenciones de Código

- ✅ Usar TypeScript para todo el código
- ✅ Seguir las reglas de ESLint
- ✅ Componentes funcionales con hooks
- ✅ Nombres descriptivos en inglés
- ✅ Comentarios en español cuando sea necesario
- ✅ Tests para funcionalidades críticas

### Commit Messages

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: añadir integración con Mercado Pago
fix: corregir cálculo de envío
docs: actualizar README con instrucciones
style: formatear código con prettier
refactor: simplificar lógica del carrito
test: añadir tests para checkout
chore: actualizar dependencias
```

---

## 🗺️ Roadmap

### ✅ Fase 0: Preparación (Completado)
- [x] Definir arquitectura
- [x] Configurar dominio (pocapay.com)
- [x] Configurar emails (Larksuite)
- [x] Configurar Mercado Pago
- [x] Análisis de competidores
- [x] Elegir stack tecnológico

### 🚧 Fase 1: MVP E-commerce (En Progreso)
- [x] Setup proyecto Next.js
- [x] Configurar Prisma + PostgreSQL
- [ ] Sistema de autenticación
- [ ] Catálogo de productos
- [ ] Carrito de compras
- [ ] Checkout con Mercado Pago
- [ ] Panel admin básico

### 📋 Fase 2: Órdenes y Envíos (Pendiente)
- [ ] Sistema de órdenes
- [ ] Integración con paqueterías
- [ ] Tracking de envíos
- [ ] Notificaciones automáticas
- [ ] Gestión de inventario

### 📋 Fase 3: Sistema Financiero (Pendiente)
- [ ] Dashboard financiero
- [ ] Facturación CFDI 4.0
- [ ] Reportes avanzados
- [ ] Cuentas por cobrar/pagar

### 📋 Fase 4: CRM y Marketing (Pendiente)
- [ ] CRM completo
- [ ] Email marketing
- [ ] Programa de lealtad
- [ ] Sistema de referidos

### 📋 Fase 5: Características Avanzadas (Futuro)
- [ ] IA para recomendaciones
- [ ] Sistema de preventas
- [ ] PWA instalable
- [ ] Multi-idioma (KR/EN/ES)
- [ ] Integraciones sociales

### 📋 Fase 6: Optimización (Futuro)
- [ ] Performance optimization
- [ ] Testing E2E completo
- [ ] Auditoría de seguridad
- [ ] CI/CD pipeline

---

## 📊 KPIs y Métricas

Métricas clave que monitoreamos:

### Ventas
- 📈 Ventas totales por período
- 💰 Ticket promedio
- 📊 Tasa de conversión
- 🔥 Productos más vendidos
- 🛒 Tasa de carritos abandonados

### Marketing
- 💵 Costo de adquisición (CAC)
- 💎 Lifetime Value (LTV)
- 📊 ROI por canal
- 🌐 Tráfico web
- 📧 Tasa de apertura de emails

### Operaciones
- ⚡ Tiempo promedio de entrega
- 🔄 Tasa de devoluciones
- ⭐ Satisfacción del cliente (NPS)
- ⏱️ Tiempo de respuesta de soporte

---

## 🔒 Seguridad

- 🔐 **HTTPS** en todos los endpoints
- 🔑 **Encriptación** de contraseñas con bcrypt
- 🛡️ **CSRF Protection** habilitado
- 🚫 **Rate limiting** en API routes
- 🔍 **Validación** de datos con Zod
- 🔒 **3D Secure** en pagos con tarjeta
- 📝 **Logs** de auditoría
- 💾 **Backups** automáticos diarios

---

## 📄 Licencia

Este proyecto es **privado y propietario** de:

**POCAPAY GO SAS DE CV**  
Todos los derechos reservados © 2025

Uso no autorizado está prohibido.

---

## 👥 Equipo

### Fundadores

**Néstor Moreno Mendoza** - CEO & Founder  
📧 nestormorenomendoza@pocapay.com  
🔗 [LinkedIn](#) | [GitHub](#)

**Marco Antonio Lafarga Roa** - CO CEO  
📧 marcolafarga@pocapay.com  
🔗 [LinkedIn](#) | [GitHub](#)

### Contacto Empresarial

- 🌐 **Web:** [pocapay.com](https://pocapay.com)
- 📧 **Email:** pocapay@pocapay.com
- 🛟 **Soporte:** soporte@pocapay.com
- 📦 **Distribución:** distribucion@pocapay.com
- 📍 **Ubicación:** Guadalajara, Jalisco, México

### Redes Sociales

- 📱 **Instagram:** [@pocapaygo](#)
- 🎮 **Discord:** [Comunidad POCAPAY](#)
- 🐦 **Twitter/X:** [@pocapaygo](#)
- 📘 **Facebook:** [POCAPAY GO](#)
- 🎵 **TikTok:** [@pocapaygo](#)

---

## 🙏 Agradecimientos

- **shadcn/ui** - Por los increíbles componentes UI
- **Next.js Team** - Por el mejor framework React
- **Vercel** - Por las herramientas de desarrollo
- **Prisma** - Por el mejor ORM
- **Dokploy** - Por la plataforma open source
- **Comunidad K-POP México** - Por el apoyo constante

---

## 📚 Recursos Adicionales

### Documentación
- 📖 [Guía de Dokploy](./Guia-Dokploy.md)
- 📖 [Guía de Larksuite](./Guia-Larksuite.md)
- 📖 [Guía de Notion MCP](./Guia-Notion-MCP.md)
- 💬 [Análisis de Chatwoot (CRM)](./CHATWOOT-ANALISIS.md) ⭐ **RECOMENDADO**
- 💬 [Resumen Ejecutivo Chatwoot](./CHATWOOT-RESUMEN.md)
- 📖 [Análisis de Competidores](./Analisis-Tiendas-KPOP.md)
- 📖 [Plan Maestro](./Empresa.md)

### Útiles
- 🛠️ [Next.js Docs](https://nextjs.org/docs)
- 🛠️ [Prisma Docs](https://www.prisma.io/docs)
- 🛠️ [Tailwind CSS Docs](https://tailwindcss.com/docs)
- 🛠️ [shadcn/ui Docs](https://ui.shadcn.com)
- 🛠️ [Mercado Pago Developers](https://www.mercadopago.com.mx/developers)

---

<div align="center">

### 🎵 ¡Hecho con 💜 para los fans del K-POP!

**POCAPAY GO** - *Tu tienda K-POP de confianza en México*

화이팅! (Fighting!) 🇰🇷🇲🇽

---

**Última actualización:** 13 de Noviembre 2025 | **Versión:** 0.1.0

</div>
