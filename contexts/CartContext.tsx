'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { Product } from '@/lib/api'

const CART_STORAGE_KEY = 'pasteleria_cart'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  totalItems: number
  totalCLP: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  showAddedFeedback: boolean
  clearAddedFeedback: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage())
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [showAddedFeedback, setShowAddedFeedback] = useState(false)

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const addItem = useCallback((product: Product, quantity: number) => {
    if (quantity < 1 || product.stock < 1) return
    const qty = Math.min(quantity, product.stock)
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stock)
        if (newQty === 0) return prev.filter((i) => i.product.id !== product.id)
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: newQty } : i
        )
      }
      return [...prev, { product, quantity: qty }]
    })
    setShowAddedFeedback(true)
  }, [])

  const clearAddedFeedback = useCallback(() => {
    setShowAddedFeedback(false)
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId)
      if (!item) return prev
      if (quantity < 1) return prev.filter((i) => i.product.id !== productId)
      const newQty = Math.min(quantity, item.product.stock)
      return prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: newQty } : i
      )
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)
  const totalCLP = items.reduce((acc, i) => acc + i.product.priceCLP * i.quantity, 0)

  const value: CartContextType = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalCLP,
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    showAddedFeedback,
    clearAddedFeedback,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider')
  }
  return context
}
