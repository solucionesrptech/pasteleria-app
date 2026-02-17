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

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

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
