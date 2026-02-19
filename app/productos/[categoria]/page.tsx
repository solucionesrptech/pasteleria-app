import { notFound } from 'next/navigation'
import { fetchProducts } from '@/lib/api'
import { ProductosGrid } from '@/components/productos/ProductosGrid'

interface PageProps {
  params: {
    categoria: string
  }
}

// Mapeo de categorías válidas
const categoriasValidas: Record<string, { title: string; subtitle: string }> = {
  cumpleanos: {
    title: 'Tortas de Cumpleaños',
    subtitle: 'Clásicos, infantiles o para adultos',
  },
  matrimonio: {
    title: 'Tortas de Matrimonio',
    subtitle: 'Elegantes, delicados y personalizados',
  },
  'baby-shower': {
    title: 'Tortas de Baby Shower',
    subtitle: 'Suaves, tiernos y llenos de detalles',
  },
  graduacion: {
    title: 'Tortas de Graduación',
    subtitle: 'Un logro que se celebra en grande',
  },
  aniversario: {
    title: 'Tortas de Aniversario',
    subtitle: 'Para compartir y recordar',
  },
  'porque-si': {
    title: 'Tortas Porque Sí',
    subtitle: 'No necesitas una razón para algo rico',
  },
}

// Función para filtrar productos por categoría (temporal hasta que haya categorías en el backend)
function filterProductsByCategory(products: any[], categoria: string) {
  // Por ahora, retornamos todos los productos activos
  // En el futuro, esto se filtrará por categoría desde el backend
  return products.filter((p) => p.active).slice(0, 6)
}

async function getProductsByCategory(categoria: string) {
  try {
    const products = await fetchProducts()
    return filterProductsByCategory(products, categoria)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductosCategoriaPage({ params }: PageProps) {
  const { categoria } = params
  const categoriaInfo = categoriasValidas[categoria]

  if (!categoriaInfo) {
    notFound()
  }

  const products = await getProductsByCategory(categoria)

  return (
    <div className="min-h-screen">
      {/* Hero Section con mismo fondo que página principal */}
      <section className="relative bg-[url('/images/background/hero-pasteleria.png')] bg-cover bg-center bg-no-repeat py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-decorative text-5xl lg:text-6xl xl:text-7xl font-normal text-white mb-4">
              {categoriaInfo.title}
            </h1>
            <p className="font-lora text-xl lg:text-2xl xl:text-3xl font-semibold text-white">
              {categoriaInfo.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Sección de Productos - Client Component */}
      <section className="relative py-16 bg-[url('/images/background/fondoCard.png')] bg-cover bg-center bg-no-repeat">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductosGrid products={products} />
        </div>
      </section>
    </div>
  )
}
