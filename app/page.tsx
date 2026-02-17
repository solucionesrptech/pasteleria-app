import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CelebrationSection } from '@/components/shared/CelebrationSection'
import { AntojosSection } from '@/components/shared/AntojosSection'
import { fetchProducts } from '@/lib/api'

async function getProducts() {
  try {
    const products = await fetchProducts()
    return products.slice(0, 8)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function Home() {
  const products = await getProducts()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/images/logo/logo.png" 
                alt="Pastelería Bella Logo" 
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-3xl font-bold text-teal-600">Pastelería Bella</h1>
                <p className="text-stone-600 text-sm mt-1">Deliciosos pasteles y tortas artesanales</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#productos" className="text-stone-700 hover:text-teal-600 transition-colors duration-200">
                Productos
              </a>
              <a href="#valores" className="text-stone-700 hover:text-teal-600 transition-colors duration-200">
                Nosotros
              </a>
              <a href="#contacto" className="text-stone-700 hover:text-teal-600 transition-colors duration-200">
                Contacto
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-[url('/images/background/hero-pasteleria.png')] bg-cover bg-center bg-no-repeat py-24 lg:py-32 xl:py-40">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-decorative text-6xl lg:text-7xl xl:text-8xl font-normal text-white mb-6">
              Pastelería Bella
            </h1>
            <p className="font-lora text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-6">
              Tortas personalizadas<br />
              para tus momentos especiales
            </p>
            <p className="text-lg lg:text-xl xl:text-2xl text-white mb-10">
              Cuéntanos y preparamos cada torta con el<br />
              diseño, sabor y estilo que imaginas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="rounded-full bg-[url('/images/background/fondoCard.png')] bg-cover bg-center bg-no-repeat text-stone-800 text-lg font-semibold px-10 py-5 shadow-md hover:shadow-lg transition-all duration-200">
                Cuéntanos tu idea
              </button>
              <button className="rounded-full bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold px-10 py-5 shadow-md hover:shadow-lg transition-all duration-200">
                Ver catálogo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      {products.length > 0 && (
        <section id="productos" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-teal-800 mb-4">Productos Destacados</h2>
              <p className="text-stone-600 text-lg">Nuestros pasteles más populares</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="flex flex-col">
                  <div className="flex-1">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-stone-400 text-sm">Sin imagen</span>
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-teal-800 mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-teal-600">
                        {formatPrice(product.priceCLP)}
                      </span>
                      {product.stock > 0 ? (
                        <Badge variant="success">Disponible</Badge>
                      ) : (
                        <Badge variant="error">Agotado</Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="primary" className="w-full">
                    Agregar al Carrito
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sección ¿Qué estás celebrando? */}
      <CelebrationSection />

      {/* Sección Algunos de nuestros antojos */}
      <AntojosSection />

      {/* Valores de la Empresa */}
      <section id="valores" className="py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-teal-800 mb-4">¿Por qué elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-800 mb-2">Calidad Premium</h3>
              <p className="text-stone-600">Ingredientes frescos y de la más alta calidad en cada preparación.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🍰</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-800 mb-2">Hecho Artesanalmente</h3>
              <p className="text-stone-600">Cada pastel es preparado a mano con dedicación y cuidado.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-800 mb-2">Entrega Rápida</h3>
              <p className="text-stone-600">Delivery disponible en Santiago Centro, fresco y a tiempo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-teal-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pastelería Bella</h3>
              <p className="text-teal-200">Deliciosos pasteles y tortas artesanales hechos con amor.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <p className="text-teal-200 mb-2">Santiago Centro, Chile</p>
              <p className="text-teal-200">Horario: 09:00 - 17:00</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/56912345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors duration-200"
                  aria-label="WhatsApp"
                >
                  <span className="text-lg">💬</span>
                </a>
                <a
                  href="https://instagram.com/pasteleriabella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <span className="text-lg">📷</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-teal-700 mt-8 pt-8 text-center text-teal-200 text-sm">
            <p>&copy; 2024 Pastelería Bella. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
