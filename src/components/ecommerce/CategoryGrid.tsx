import React from 'react'
import { ArrowRight } from 'lucide-react'
import { LuxuryCard } from '@/components/ui/luxury-card'
import { cn } from '@/lib/utils'

interface Category {
  id: string
  name: string
  image: string
  productCount?: number
  featured?: boolean
}

interface CategoryGridProps {
  categories: Category[]
  onCategoryClick?: (categoryId: string) => void
  className?: string
}

export default function CategoryGrid({ 
  categories, 
  onCategoryClick,
  className 
}: CategoryGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
      className
    )}>
      {categories.map((category, index) => (
        <LuxuryCard
          key={category.id}
          variant="interactive"
          padding="none"
          className={cn(
            "group overflow-hidden cursor-pointer animate-fade-in",
            category.featured && "md:col-span-2 lg:col-span-2"
          )}
          style={{ animationDelay: `${index * 100}ms` }}
          onClick={() => onCategoryClick?.(category.id)}
        >
          {/* Category Image */}
          <div className={cn(
            "relative overflow-hidden bg-gradient-surface",
            category.featured ? "aspect-[2/1]" : "aspect-square"
          )}>
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-category.jpg'
              }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-1">
                    {category.name}
                  </h3>
                  {category.productCount && (
                    <p className="text-sm text-white/80">
                      {category.productCount} produit{category.productCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </LuxuryCard>
      ))}
    </div>
  )
}