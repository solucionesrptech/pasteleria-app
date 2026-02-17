import React from 'react'
import { CelebrationCard } from './CelebrationCard'

interface CelebrationData {
  id: string
  title: string
  subtitle: string
  imageUrl: string
}

const celebrations: CelebrationData[] = [
  {
    id: 'cumpleanos',
    title: 'Cumpleaños',
    subtitle: 'Clásicos, infantiles o para adultos',
    imageUrl: '/images/celebraciones/cumpleaños.JPG',
  },
  {
    id: 'matrimonio',
    title: 'Matrimonio',
    subtitle: 'Elegantes, delicados y personalizados',
    imageUrl: '/images/celebraciones/Matrimonio.JPG',
  },
  {
    id: 'baby-shower',
    title: 'Baby Shower',
    subtitle: 'Suaves, tiernos y llenos de detalles',
    imageUrl: '/images/celebraciones/BabyShower.JPG',
  },
  {
    id: 'graduacion',
    title: 'Graduación',
    subtitle: 'Un logro que se celebra en grande',
    imageUrl: '/images/celebraciones/Graduación.JPG',
  },
  {
    id: 'aniversario',
    title: 'Aniversario',
    subtitle: 'Para compartir y recordar',
    imageUrl: '/images/celebraciones/Aniversario.JPG',
  },
  {
    id: 'porque-si',
    title: 'Porque sí',
    subtitle: 'No necesitas una razón para algo rico',
    imageUrl: '/images/celebraciones/Porquesi.JPG',
  },
]

export const CelebrationSection: React.FC = () => {
  return (
    <section className="py-16 bg-[url('/images/background/fondo.png')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-decorative text-4xl lg:text-5xl font-normal text-stone-800 mb-4">
            ¿Qué estás celebrando?
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {celebrations.map((celebration) => (
            <CelebrationCard
              key={celebration.id}
              id={celebration.id}
              title={celebration.title}
              subtitle={celebration.subtitle}
              imageUrl={celebration.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
