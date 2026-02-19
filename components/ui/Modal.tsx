'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  productId?: string
  children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, productId, children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors duration-200"
          aria-label="Cerrar"
        >
          <span className="text-2xl">×</span>
        </button>
        
        {children || (
          <div>
            <h2 className="text-2xl font-bold text-teal-800 mb-4">
              Modal de Compra
            </h2>
            <p className="text-stone-600 mb-6">
              Producto ID: {productId}
            </p>
            <p className="text-sm text-stone-500 mb-6">
              Este modal se implementará después.
            </p>
            <Button variant="primary" onClick={onClose} className="w-full">
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
