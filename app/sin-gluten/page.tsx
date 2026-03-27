import Link from 'next/link'
import { Header } from '@/components/shared/Header'
import { LandingContent } from '@/components/shared/LandingContent'

export const metadata = {
  title: 'Pastelería Sin Gluten | Pastelería Bella',
  description: 'Delicias sin gluten con el mismo sabor y calidad. Tortas y pasteles para celíacos y quienes eligen vivir sin gluten.',
}

export default function SinGlutenPage() {
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
        heroTitle="Pastelería Sin Gluten"
        heroSubtitle="El mismo sabor, sin gluten"
        heroDescription="Preparamos tortas y pasteles sin gluten, con ingredientes de calidad y el cuidado que mereces."
      />
    </div>
  )
}
