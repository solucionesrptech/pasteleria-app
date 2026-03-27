import Link from 'next/link'
import { Header } from '@/components/shared/Header'

export default function Home() {
  return (
    <div className="relative min-h-screen min-h-[100dvh] flex flex-col overflow-hidden">
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/pantallaInicio/fondoInicio.png')" }}
        aria-hidden
      />

      {/* Overlay suave para legibilidad */}
      <div className="absolute inset-0 -z-10 bg-white/25" aria-hidden />

      <Header />

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col justify-center min-h-0 py-6 lg:py-10">
          {/* Título y subtítulo */}
          <section className="text-center px-4 sm:px-6 lg:px-8 shrink-0 py-2 lg:py-4">
            <h2 className="font-decorative text-3xl lg:text-4xl font-normal text-teal-800 mb-2">
              Elige tu experiencia
            </h2>
            <p className="text-stone-600 text-base lg:text-lg max-w-lg mx-auto">
              Selecciona el tipo de pastelería que deseas explorar
            </p>
          </section>

          {/* Tarjetas */}
          <section className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6 shrink-0">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                {/* Pastelería Sin Gluten */}
                <Link
                  href="/sin-gluten"
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden transition-shadow duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex flex-col"
                >
                  <div className="h-36 sm:h-40 lg:h-[20dvh] lg:max-h-[190px] w-full bg-white flex items-center justify-center p-4 shrink-0">
                    <img
                      src="/images/pantallaInicio/singluten.jpeg"
                      alt="Pastelería Sin Gluten - opciones sin gluten"
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="bg-[url('/images/background/fondoCard.png')] bg-cover bg-center bg-no-repeat px-4 py-4 lg:py-5 text-center flex flex-col justify-center">
                    <h3 className="font-decorative text-2xl lg:text-3xl font-normal text-stone-800 mb-0.5">
                      Pastelería Sin Gluten
                    </h3>
                    <p className="text-stone-600 text-sm mb-3">
                      Delicias elaboradas sin gluten, con el mismo sabor y calidad.
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 group-hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors duration-200 w-fit mx-auto">
                      Entrar
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>

                {/* Pastelería Tradicional */}
                <Link
                  href="/tradicional"
                  className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden transition-shadow duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex flex-col"
                >
                  <div className="h-36 sm:h-40 lg:h-[20dvh] lg:max-h-[190px] w-full bg-white flex items-center justify-center p-4 shrink-0">
                    <img
                      src="/images/pantallaInicio/tradicional.jpeg"
                      alt="Pastelería Tradicional - tortas y pasteles clásicos"
                      className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="bg-[url('/images/background/fondoCard.png')] bg-cover bg-center bg-no-repeat px-4 py-4 lg:py-5 text-center flex flex-col justify-center">
                    <h3 className="font-decorative text-2xl lg:text-3xl font-normal text-stone-800 mb-0.5">
                      Pastelería Tradicional
                    </h3>
                    <p className="text-stone-600 text-sm mb-3">
                      Tortas y pasteles clásicos, hechos con recetas de siempre.
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 group-hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors duration-200 w-fit mx-auto">
                      Entrar
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="relative z-10 bg-teal-800/95 text-white py-3 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-teal-200 text-xs">
            &copy; {new Date().getFullYear()} Pastelería Bella. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}