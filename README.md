# Pastelería Bella - Frontend

Frontend de Pastelería Bella construido con Next.js 14.

## Stack Tecnológico

- Next.js 14+ (App Router)
- React 18
- TypeScript
- Tailwind CSS

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` y configura los valores según tu entorno:

```env
# URL del backend API
# IMPORTANTE: El prefijo NEXT_PUBLIC_ es necesario para exponer esta variable al cliente
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Notas importantes:**
- El archivo `.env.local` está en `.gitignore` y no se subirá a Git
- En desarrollo, si no configuras esta variable, se usará `http://localhost:3001/api` como fallback (con advertencia)
- En producción, esta variable es **obligatoria** y debe estar configurada en tu plataforma de hosting (Vercel, etc.)
- En producción, se recomienda usar HTTPS para la URL del API

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Iniciar servidor de producción
- `npm run lint` - Ejecutar linter

## Estructura del Proyecto

```
pasteleria-app/
├── app/              # Páginas y layouts (Next.js App Router)
├── components/       # Componentes React
│   ├── ui/          # Componentes UI reutilizables
│   └── shared/      # Componentes compartidos
├── lib/             # Utilidades y cliente API
├── public/          # Archivos estáticos
└── [config files]
```

## Notas

- El frontend consume las APIs del backend NestJS (`pasteleria-api`)
- Asegúrate de que el backend esté corriendo antes de iniciar el frontend
- Las imágenes están en `public/images/`
