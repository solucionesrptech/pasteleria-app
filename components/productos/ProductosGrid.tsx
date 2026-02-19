'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProductModal } from '@/components/productos/ProductModal'
import { Product, fetchProducts } from '@/lib/api'

interface ProductosGridProps {
  products: Product[]
}

export const ProductosGrid: React.FC<ProductosGridProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sincronizar productos cuando cambian las props iniciales
  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const handleProductUpdated = async () => {
    // Refrescar lista de productos después de compra
    try {
      const updatedProducts = await fetchProducts()
      const filteredProducts = updatedProducts.filter((p) => p.active).slice(0, 6)
      setProducts(filteredProducts)
      
      // Actualizar producto seleccionado si existe
      if (selectedProduct) {
        const updatedProduct = filteredProducts.find((p) => p.id === selectedProduct.id)
        if (updatedProduct) {
          setSelectedProduct(updatedProduct)
        }
      }
    } catch (error) {
      console.error('Error al refrescar productos:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleComprarClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-600 text-lg">
          No hay productos disponibles en esta categoría por el momento.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <div className="flex-1">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-teal-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-stone-400 text-sm">Sin imagen</span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-teal-800 mb-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-stone-600 text-sm mb-4 line-clamp-3">
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
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => handleComprarClick(product)}
            >
              Comprar
            </Button>
          </Card>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </>
  )
}
