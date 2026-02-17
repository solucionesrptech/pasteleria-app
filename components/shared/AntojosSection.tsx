import React from 'react'
import { CelebrationCard } from './CelebrationCard'

interface AntojoData {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  whatsappUrl?: string
}

const antojos: AntojoData[] = [
  {
    id: 'cupcakes',
    title: 'Cupcakes',
    subtitle: 'Pequeños, deliciosos y decorados',
    imageUrl: '/images/antojos/Cupcakes.JPG',
    whatsappUrl: 'https://wa.me/56912345678?text=Hola, me interesan los cupcakes',
  },
  {
    id: 'galletas',
    title: 'Galletas',
    subtitle: 'Crujientes y llenas de sabor',
    imageUrl: '/images/antojos/Galletas.JPG',
    whatsappUrl: 'https://wa.me/56912345678?text=Hola, me interesan las galletas',
  },
  {
    id: 'brownies',
    title: 'Brownies',
    subtitle: 'Chocolatosos y esponjosos',
    imageUrl: '/images/antojos/Brownies.JPG',
    whatsappUrl: 'https://wa.me/56912345678?text=Hola, me interesan los brownies',
  },
  {
    id: 'donas',
    title: 'Donas',
    subtitle: 'Esponjosas y con glaseado',
    imageUrl: '/images/antojos/Donas.JPG',
    whatsappUrl: 'https://wa.me/56912345678?text=Hola, me interesan las donas',
  },
  {
    id: 'tartaletas',
    title: 'Tartaletas',
    subtitle: 'Dulces y frutales',
    imageUrl: '/images/antojos/Tartaletas.JPG',
    whatsappUrl: 'https://wa.me/56912345678?text=Hola, me interesan las tartaletas',
  },
  {
    id: 'alfajores',
    title: 'Alfajores',
    subtitle: 'Tradicionales y rellenos',
    imageUrl: '/images/antojos/Alfajores.JPG',
    whatsappUrl: 'https://wa.me/56912345678?text=Hola, me interesan los alfajores',
  },
]

export const AntojosSection: React.FC = () => {
  return (
    <section className="py-16 bg-[url('/images/background/fondo.png')] bg-cover bg-center bg-no-repeat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-decorative text-4xl lg:text-5xl font-normal text-stone-800 mb-4">
            Algunos de nuestros antojos
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {antojos.map((antojo) => (
            <CelebrationCard
              key={antojo.id}
              id={antojo.id}
              title={antojo.title}
              subtitle={antojo.subtitle}
              imageUrl={antojo.imageUrl}
              showWhatsappBadge
              whatsappUrl={antojo.whatsappUrl}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
