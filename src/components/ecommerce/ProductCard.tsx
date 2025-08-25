import React, { useState } from 'react'
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react'
import { LuxuryCard } from '@/components/ui/luxury-card'
import { LuxuryButton } from '@/components/ui/luxury-button'
import { LuxuryBadge } from '@/components/ui/luxury-badge'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  rating?: number
  reviewCount?: number
  isNew?: boolean
  isOnSale?: boolean
  discountPercentage?: number
  isHot?: boolean
  stock?: number
  className?: string
  style?: React.CSSProperties
  onAddToCart?: (id: string) => void
  onAddToWishlist?: (id: string) => void
  onQuickView?: (id: string) => void
  onClick?: (id: string) => void
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  images = [],
  category,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  isOnSale = false,
  discountPercentage,
  isHot = false,
  stock = 0,
  className,
  style,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onClick,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const allImages = [image, ...images]
  const isOutOfStock = stock <= 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isOutOfStock) return
    setIsLoading(true)
    setTimeout(() => {
      onAddToCart?.(id)
      setIsLoading(false)
    }, 800)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(id)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView?.(id)
  }

  const renderBadges = () => (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
      {isNew && <LuxuryBadge variant="new" size="sm">Nouveau</LuxuryBadge>}
      {isOnSale && discountPercentage && (
        <LuxuryBadge variant="sale" size="sm">
          -{discountPercentage}%
        </LuxuryBadge>
      )}
      {isHot && <LuxuryBadge variant="hot" size="sm">🔥 Hot</LuxuryBadge>}
      {isOutOfStock && (
        <LuxuryBadge variant="destructive" size="sm">Épuisé</LuxuryBadge>
      )}
    </div>
  )

  const renderRating = () => (
    <div className="flex items-center gap-1 mb-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= rating 
                ? "fill-secondary text-secondary" 
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({reviewCount})</span>
    </div>
  )

  const renderPricing = () => (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-lg font-bold text-primary">
        {price.toFixed(2)} €
      </span>
      {originalPrice && originalPrice > price && (
        <span className="text-sm text-muted-foreground line-through">
          {originalPrice.toFixed(2)} €
        </span>
      )}
    </div>
  )

  return (
    <LuxuryCard 
      variant="interactive"
      padding="none"
      className={cn(
        "group overflow-hidden cursor-pointer animate-fade-in",
        isOutOfStock && "opacity-75",
        className
      )}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(id)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface">
        {renderBadges()}
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300",
            "bg-white/80 dark:bg-black/80 backdrop-blur-sm",
            "opacity-0 group-hover:opacity-100 hover:scale-110",
            isWishlisted && "opacity-100 text-primary"
          )}
        >
          <Heart 
            className={cn("h-4 w-4", isWishlisted && "fill-current")} 
          />
        </button>

        {/* Product Image */}
        <img
          src={allImages[currentImageIndex]}
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isHovered && "scale-105"
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-product.jpg'
          }}
        />

        {/* Image Indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(index)
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === currentImageIndex 
                    ? "bg-primary scale-125" 
                    : "bg-white/50 hover:bg-white/75"
                )}
              />
            ))}
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-all duration-300",
          "flex items-center justify-center gap-2",
          "opacity-0 group-hover:opacity-100"
        )}>
          <LuxuryButton
            variant="glass"
            size="icon"
            onClick={handleQuickView}
            className="hover:scale-110"
          >
            <Eye className="h-4 w-4" />
          </LuxuryButton>
          
          {!isOutOfStock && (
            <LuxuryButton
              variant="primary"
              size="icon"
              onClick={handleAddToCart}
              loading={isLoading}
              className="hover:scale-110 animate-cart-bounce"
            >
              <ShoppingCart className="h-4 w-4" />
            </LuxuryButton>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <LuxuryBadge variant="outline" size="sm" className="mb-2">
          {category}
        </LuxuryBadge>
        
        {renderRating()}
        
        <h3 className="font-heading font-semibold text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        {renderPricing()}
        
        {stock > 0 && stock <= 5 && (
          <p className="text-xs text-warning">
            Plus que {stock} en stock !
          </p>
        )}
      </div>
    </LuxuryCard>
  )
}