import Link from 'next/link'
import { Header } from '@/components/shared/Header'
import { LandingContent } from '@/components/shared/LandingContent'

export const metadata = {
  title: 'Pastelería Tradicional | Pastelería Bella',
  description: 'Tortas y pasteles tradicionales, hechos con recetas de siempre. Calidad artesanal para tus momentos especiales.',
}

export default function TradicionalPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="mb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <Link
          href="/"
          className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-200"
        >
          ← Volver a elegir experiencia
        </Link>
      </div>
      <LandingContent
        heroTitle="Pastelería Tradicional"
        heroSubtitle="Tortas personalizadas para tus momentos especiales"
        heroDescription="Cuéntanos y preparamos cada torta con el diseño, sabor y estilo que imaginas."
      />
    </div>
  )
}
