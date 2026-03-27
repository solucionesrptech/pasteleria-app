import { CelebrationSection } from '@/components/shared/CelebrationSection'
import { AntojosSection } from '@/components/shared/AntojosSection'

interface LandingContentProps {
  heroTitle: string
  heroSubtitle: string
  heroDescription?: string
}

export function LandingContent({
  heroTitle,
  heroSubtitle,
  heroDescription = 'Cuéntanos y preparamos cada torta con el diseño, sabor y estilo que imaginas.',
}: LandingContentProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-[url('/images/background/hero-pasteleria.png')] bg-cover bg-center bg-no-repeat py-24 lg:py-32 xl:py-40">
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-decorative text-6xl lg:text-7xl xl:text-8xl font-normal text-white mb-6">
              {heroTitle}
            </h1>
            <p className="font-lora text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-6">
              {heroSubtitle}
            </p>
            <p className="text-lg lg:text-xl xl:text-2xl text-white mb-10">
              {heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/56912345678"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[url('/images/background/fondoCard.png')] bg-cover bg-center bg-no-repeat text-stone-800 text-lg font-semibold px-10 py-5 shadow-md hover:shadow-lg transition-all duration-200 text-center"
              >
                Cuéntanos tu idea
              </a>
              <a
                href="#productos"
                className="rounded-full bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold px-10 py-5 shadow-md hover:shadow-lg transition-all duration-200 text-center"
              >
                Ver catálogo
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="productos" aria-label="Productos y celebraciones">
        <CelebrationSection />
      </section>
      <AntojosSection />

      {/* Valores */}
      <section id="valores" className="py-16 bg-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-teal-800 mb-4">¿Por qué elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl" aria-hidden>✨</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-800 mb-2">Calidad Premium</h3>
              <p className="text-stone-600">Ingredientes frescos y de la más alta calidad en cada preparación.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl" aria-hidden>🍰</span>
              </div>
              <h3 className="text-xl font-semibold text-teal-800 mb-2">Hecho Artesanalmente</h3>
              <p className="text-stone-600">Cada pastel es preparado a mano con dedicación y cuidado.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl" aria-hidden>🚀</span>
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
                  <span className="text-lg" aria-hidden>💬</span>
                </a>
                <a
                  href="https://instagram.com/pasteleriabella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <span className="text-lg" aria-hidden>📷</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-teal-700 mt-8 pt-8 text-center text-teal-200 text-sm">
            <p>&copy; {new Date().getFullYear()} Pastelería Bella. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
